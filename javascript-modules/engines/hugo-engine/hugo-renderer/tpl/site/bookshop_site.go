// Copyright 2017 The Hugo Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Package site stubs out some of the Hugo site functions for use in Bookshop live editing.
package site

import (
	"hugo-renderer/deps"
	library "hugo-renderer/tpl/bookshop_library"
)

func New(deps *deps.Deps) *Namespace {
	return &Namespace{
		deps: deps,
	}
}

type Namespace struct {
	deps *deps.Deps
}

// Data returns any data that was present in the _cloudcannon/info.json
// This will require `data_config: true` in the site cloudcannon.config.yml
func (ns *Namespace) Data() (map[string]interface{}, error) {
	data := library.RetrieveHugoBookshopData()

	return data.Data, nil
}

// site.Title should have been stashed inside a Bookshop meta comment
func (ns *Namespace) Title() (interface{}, error) {
	meta := library.RetrieveHugoBookshopMeta()

	return meta["title"], nil
}

// site.Copyright should have been stashed inside a Bookshop meta comment
func (ns *Namespace) Copyright() (interface{}, error) {
	meta := library.RetrieveHugoBookshopMeta()

	return meta["copyright"], nil
}

// site.BaseURL should have been stashed inside a Bookshop meta comment
func (ns *Namespace) BaseURL() (interface{}, error) {
	meta := library.RetrieveHugoBookshopMeta()

	return meta["baseurl"], nil
}

// Pending mock out of the params function
func (ns *Namespace) Params() (map[string]interface{}, error) {
	params := make(map[string]interface{})
	params["env_bookshop_live"] = true

	return params, nil
}
