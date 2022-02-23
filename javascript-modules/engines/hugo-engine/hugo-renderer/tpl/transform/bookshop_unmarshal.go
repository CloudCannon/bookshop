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

package transform

import (
	"encoding/json"

	"github.com/pkg/errors"
)

// Unmarshal unmarshals the data given, which can be either a string, json.RawMessage
// or a Resource. Supported formats are JSON, TOML, YAML, and CSV.
// You can optionally provide an options map as the first argument.
func (ns *Namespace) BookshopUnmarshal(args ...interface{}) (interface{}, error) {
	if len(args) != 1 {
		return nil, errors.New("Bookshop unmarshal takes 1 argument")
	}

	var data interface{}

	if r, ok := args[0].(string); ok {
		if err := json.Unmarshal([]byte(r), &data); err != nil {
			return nil, err
		}
		return data, nil
	}
	return nil, errors.New("Needed a string")
}
