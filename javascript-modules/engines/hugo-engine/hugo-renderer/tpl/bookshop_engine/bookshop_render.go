package engine

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"

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

// RenderHugo takes a component from the browser,
// as well as a JSON blob of its data,
// and renders it.
func RenderHugo(templateString string, props string) interface{} {
	var parsedProps interface{}
	err := json.Unmarshal([]byte(props), &parsedProps)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("BKSHERR: bad json unmarshal: %s", err.Error()))
		return buf.String()
	}

	d := deps.Deps{}
	funcMap := createFuncMap(&d)

	templ, err := template.New("").Funcs(funcMap).Parse(templateString)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("BKSHERR: bad template parse: %s", err.Error()))
		return buf.String()
	}

	buf := bytes.NewBufferString("")
	err = templ.Execute(buf, parsedProps)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("BKSHERR: bad template render: %s", err.Error()))
		return buf.String()
	}
	return buf.String()
}
