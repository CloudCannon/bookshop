package bookshop_library

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"strings"

	"hugo-renderer/deps"
	"hugo-renderer/tpl/internal"
)

// TODO(bookshop): DRY
func createFuncMap(d *deps.Deps) map[string]interface{} {
	funcMap := template.FuncMap{}

	// Merge the namespace funcs
	for _, nsf := range internal.TemplateFuncsNamespaceRegistry {
		ns := nsf(d)
		if _, exists := funcMap[ns.Name]; exists {
			panic(ns.Name + " is a duplicate template func")
		}
		funcMap[ns.Name] = ns.Context
		for _, mm := range ns.MethodMappings {
			for _, alias := range mm.Aliases {
				if _, exists := funcMap[alias]; exists {
					panic(alias + " is a duplicate template func")
				}
				funcMap[alias] = mm.Method
			}
		}
	}

	return funcMap
}

type bookshopPartial struct {
	Contents       string `json:"contents"`
	ParsedContents *template.Template
}

var componentLibrary map[string]bookshopPartial

// LoadHugoBookshopPartials takes all files that the
// @bookshop/hugo-engine was given and stashes them away
// on this side of the wasm boundary, for the partials
// function to use.
func LoadHugoBookshopPartials(partials string) interface{} {
	err := json.Unmarshal([]byte(partials), &componentLibrary)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad json unmarshal: %s", err.Error()))
		return buf.String()
	}

	buf := bytes.NewBufferString(fmt.Sprintf("loaded %d components", len(componentLibrary)))
	return buf.String()
}

// RetrieveBookshopPartial looks for a Bookshop file
// and returns its template in a standard lib go html/template.
// TODO(bookshop): This should probably one day play
// nicer with the Hugo templating packages.
func RetrieveBookshopPartial(bookshop_key string) (*template.Template, bool) {
	if component, ok := componentLibrary[bookshop_key]; ok {
		if component.ParsedContents == nil {
			d := deps.Deps{}
			funcMap := createFuncMap(&d)
			templ, err := template.New("").Funcs(funcMap).Parse(component.Contents)
			if err != nil {
				return nil, false
			}
			component.ParsedContents = templ
		}
		return component.ParsedContents, true
	}
	return nil, false
}

func bookshopKey(full_key string) string {
	split := strings.Split(full_key, "/")
	base := split[len(split)-1]
	return fmt.Sprintf("components/%s/%s.hugo.html", full_key, base)
}

// UnwrapBookshopPartial takes the dict or slice that the {{ partial "bookshop" ... }}
// was given, and pulls out the component / partial name that should be rendered.
// TODO(bookshop): Ideally our templating support gets better,
// and we can call the production bookshop module partials.
func UnwrapBookshopComponent(context interface{}) (string, interface{}) {
	if componentData, ok := context.(map[string]interface{}); ok {
		if component, ok := componentData["_bookshop_name"]; ok {
			key := bookshopKey(component.(string))
			return key, context
		}
		return "err_no_bookshop_name_key", context
	}
	if componentData, ok := context.([]interface{}); ok {
		if component, ok := componentData[0].(string); ok {
			key := bookshopKey(component)
			return key, componentData[1]
		}
		return "err_slice_zero_not_string", context
	}
	if componentData, ok := context.([]string); ok {
		key := bookshopKey(componentData[0])
		return key, componentData[1]
	}
	if componentName, ok := context.(string); ok {
		key := bookshopKey(componentName)
		return key, nil
	}
	return "err_not_map_slice_or_string", context
}

func UnwrapBookshopPartial(context interface{}) (string, interface{}) {
	if partialData, ok := context.([]interface{}); ok {
		if partial, ok := partialData[0].(string); ok {
			key := fmt.Sprintf("shared/hugo/%s.hugo.html", partial)
			return key, partialData[1]
		}
		return "err_slice_zero_not_string", context
	}
	if partialName, ok := context.(string); ok {
		key := fmt.Sprintf("shared/hugo/%s.hugo.html", partialName)
		return key, nil
	}
	return "err_not_slice_or_string", context
}
