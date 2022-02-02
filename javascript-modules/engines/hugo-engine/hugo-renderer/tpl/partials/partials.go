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

// Package partials provides template functions for working with reusable
// templates.
package partials

import (
	"bytes"
	"fmt"
	"html/template"
	"strings"

	library "hugo-renderer/tpl/bookshop_library"

	"hugo-renderer/deps"
)

// Bookshop: This file has been stripped to only support Bookshop partials when live editing.

// New returns a new instance of the templates-namespaced template functions.
func New(deps *deps.Deps) *Namespace {
	return &Namespace{}
}

// Namespace provides template functions for the "templates" namespace.
type Namespace struct {
}

// Include executes the named partial.
// If the partial contains a return statement, that value will be returned.
// Else, the rendered output will be returned:
// A string if the partial is a text/template, or template.HTML when html/template.
func (ns *Namespace) Include(tagname string, contextList ...interface{}) (interface{}, error) {
	// TODO(bookshop): Fallback to this
	_ = strings.TrimPrefix(name, "partials/")

	var context interface{}
	if len(contextList) > 0 {
		context = contextList[0]
	}

	var name string

	switch tagname {
	case "bookshop":
		name, context = library.UnwrapBookshopComponent(context)
	case "bookshop_partial":
		name, context = library.UnwrapBookshopPartial(context)
	default:
		panic("Can't render standard includes yet")
	}

	templ, found := library.RetrieveBookshopPartial(name)

	if !found {
		// TODO(bookshop): Fallback to the name above
		return "", fmt.Errorf("partial %q not found", name)
	}

	// TODO(bookshop): Large section of code was omitted
	// meaning partials with return values won't work.

	buf := bytes.NewBufferString("")
	if err := templ.Execute(buf, context); err != nil {
		return "", err
	}

	return template.HTML(buf.String()), nil
}

// IncludeCached executes and caches partial templates.  The cache is created with name+variants as the key.
func (ns *Namespace) IncludeCached(name string, context interface{}, variants ...interface{}) (interface{}, error) {
	// Bookshop skips cached partials
	// because partial rendering is implemented at a higher
	// asbtraction level
	return ns.Include(name, context)
}
