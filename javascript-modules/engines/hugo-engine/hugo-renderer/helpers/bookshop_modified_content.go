// Copyright 2019 The Hugo Authors. All rights reserved.
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

// Package helpers implements general utility functions that work with
// and on content.  The helper functions defined here lay down the
// foundation of how Hugo works with files and filepaths, and perform
// string operations on content.
package helpers

import (
	"bytes"
	"html/template"
	"strings"
	"unicode"

	bp "github.com/gohugoio/hugo/bufferpool"
)

var (
	openingPTag        = []byte("<p>")
	closingPTag        = []byte("</p>")
	paragraphIndicator = []byte("<p")
	closingIndicator   = []byte("</")
)

var stripHTMLReplacer = strings.NewReplacer("\n", " ", "</p>", "\n", "<br>", "\n", "<br />", "\n")

// StripHTML accepts a string, strips out all HTML tags and returns it.
func StripHTML(s string) string {
	// Shortcut strings with no tags in them
	if !strings.ContainsAny(s, "<>") {
		return s
	}
	s = stripHTMLReplacer.Replace(s)

	// Walk through the string removing all tags
	b := bp.GetBuffer()
	defer bp.PutBuffer(b)
	var inTag, isSpace, wasSpace bool
	for _, r := range s {
		if !inTag {
			isSpace = false
		}

		switch {
		case r == '<':
			inTag = true
		case r == '>':
			inTag = false
		case unicode.IsSpace(r):
			isSpace = true
			fallthrough
		default:
			if !inTag && (!isSpace || (isSpace && !wasSpace)) {
				b.WriteRune(r)
			}
		}

		wasSpace = isSpace

	}
	return b.String()
}

// BytesToHTML converts bytes to type template.HTML.
func BytesToHTML(b []byte) template.HTML {
	return template.HTML(string(b))
}

// TrimShortHTML removes the <p>/</p> tags from HTML input in the situation
// where said tags are the only <p> tags in the input and enclose the content
// of the input (whitespace excluded).
// Bookshop: Changed this to _not_ be a method of *ContentSpec
func TrimShortHTML(input []byte) []byte {
	firstOpeningP := bytes.Index(input, paragraphIndicator)
	lastOpeningP := bytes.LastIndex(input, paragraphIndicator)

	lastClosingP := bytes.LastIndex(input, closingPTag)
	lastClosing := bytes.LastIndex(input, closingIndicator)

	if firstOpeningP == lastOpeningP && lastClosingP == lastClosing {
		input = bytes.TrimSpace(input)
		input = bytes.TrimPrefix(input, openingPTag)
		input = bytes.TrimSuffix(input, closingPTag)
		input = bytes.TrimSpace(input)
	}
	return input
}
