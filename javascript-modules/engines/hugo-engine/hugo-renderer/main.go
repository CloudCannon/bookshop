package main

import (
	"syscall/js"

	engine "hugo-renderer/tpl/bookshop_engine"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("renderHugo", js.FuncOf(renderHugo))
	<-c
}

func renderHugo(this js.Value, args []js.Value) interface{} {
	templateString := args[0].String()
	propsString := args[1].String()

	return engine.RenderHugo(templateString, propsString)
}
