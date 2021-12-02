package engine

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
)

func RenderHugo(templateString string, props string) interface{} {
	var parsedProps map[string]interface{}
	err := json.Unmarshal([]byte(props), &parsedProps)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad json unmarshal: %s", err.Error()))
		return buf.String()
	}

	funcMap := make(template.FuncMap)

	templ, err := template.New("").Funcs(funcMap).Parse(templateString)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad template parse: %s", err.Error()))
		return buf.String()
	}

	buf := bytes.NewBufferString("")
	err = templ.Execute(buf, parsedProps)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad template render: %s", err.Error()))
		return buf.String()
	}
	return buf.String()
}
