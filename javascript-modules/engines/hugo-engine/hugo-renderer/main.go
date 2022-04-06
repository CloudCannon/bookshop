package main

import (
	"syscall/js"

	engine "hugo-renderer/tpl/bookshop_engine"
	library "hugo-renderer/tpl/bookshop_library"
)

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("renderHugo", js.FuncOf(renderHugo))
	js.Global().Set("loadHugoBookshopPartials", js.FuncOf(loadHugoBookshopPartials))
	js.Global().Set("loadHugoBookshopData", js.FuncOf(loadHugoBookshopData))
	js.Global().Set("loadHugoBookshopMeta", js.FuncOf(loadHugoBookshopMeta))
	<-c
}

func renderHugo(this js.Value, args []js.Value) interface{} {
	templateString := args[0].String()
	propsString := args[1].String()

	return engine.RenderHugo(templateString, propsString)
}

func loadHugoBookshopPartials(this js.Value, args []js.Value) interface{} {
	bookshopPartials := args[0].String()

	return library.LoadHugoBookshopPartials(bookshopPartials)
}

func loadHugoBookshopData(this js.Value, args []js.Value) interface{} {
	bookshopData := args[0].String()

	return library.LoadHugoBookshopData(bookshopData)
}

func loadHugoBookshopMeta(this js.Value, args []js.Value) interface{} {
	bookshopMeta := args[0].String()

	return library.LoadHugoBookshopMeta(bookshopMeta)
}
