package bookshop_library

import (
	"bytes"
	"encoding/json"
	"fmt"
)

type bookshopData struct {
	Data map[string]interface{} `json:"data"`
}

var bookshopDataStorage bookshopData

// loadHugoBookshopData takes any data that the @bookshop/hugo-engine
// was given from info.json and stashes it all away
// on this side of the wasm boundary, for the site
// function to use.
func LoadHugoBookshopData(data string) interface{} {
	err := json.Unmarshal([]byte(data), &bookshopDataStorage)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad json unmarshal: %s", err.Error()))
		return buf.String()
	}

	buf := bytes.NewBufferString("loaded Bookshop site data")
	return buf.String()
}

func RetrieveHugoBookshopData() *bookshopData {
	return &bookshopDataStorage
}

var bookshopMetaStorage map[string]interface{}

// loadHugoBookshopMeta takes any data that hugo/bookshop
// injected into the template and stashes it all away
// on this side of the wasm boundary, for the site
// function to use.
func LoadHugoBookshopMeta(data string) interface{} {
	err := json.Unmarshal([]byte(data), &bookshopMetaStorage)
	if err != nil {
		buf := bytes.NewBufferString(fmt.Sprintf("bad json unmarshal: %s", err.Error()))
		return buf.String()
	}

	buf := bytes.NewBufferString("loaded Bookshop site data")
	return buf.String()
}

func RetrieveHugoBookshopMeta() map[string]interface{} {
	return bookshopMetaStorage
}
