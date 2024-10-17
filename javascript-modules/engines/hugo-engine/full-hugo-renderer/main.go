// Copyright 2015 The Hugo Authors. All rights reserved.
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

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"syscall/js"

	"github.com/fsnotify/fsnotify"
	"github.com/gohugoio/hugo/config"
	"github.com/gohugoio/hugo/config/allconfig"
	"github.com/gohugoio/hugo/deps"
	"github.com/gohugoio/hugo/hugofs"
	"github.com/gohugoio/hugo/hugolib"
	"github.com/spf13/afero"
)

type bookshopSiteBuilder struct {
	Cfg          *allconfig.Configs
	Afs          afero.Fs
	Fs           *hugofs.Fs
	Sites        *hugolib.HugoSites
	changedFiles []string
}

// Load whatever source config file we have previously written to disk
func (builder *bookshopSiteBuilder) LoadConfig() error {
	cfg, err := allconfig.LoadConfig(allconfig.ConfigSourceDescriptor{
		Fs:       builder.Afs,
		Flags:    config.New(),
		Filename: "config.toml",
	})
	if err != nil {
		return err
	}

	// Bookshop runs "rebuilds" rather than fresh builds to improve re-render speed
	cfg.Base.WorkingDir = ""
	cfg.Base.Internal.Running = true
	cfg.Base.Internal.Watch = true
	builder.Cfg = cfg
	builder.Fs = hugofs.NewFrom(builder.Afs, cfg.GetFirstLanguageConfig().BaseConfig())

	return nil
}

// Create our Hugo sites
// TODO: I don't know how the lang aspects of Hugo
// will interact with Hugo.
func (builder *bookshopSiteBuilder) CreateSites() error {
	if err := builder.LoadConfig(); err != nil {
		fmt.Println(fmt.Sprintf("failed to load config: %s", err))
		return fmt.Errorf("failed to load config: %w", err)
	}

	builder.Fs.PublishDir = hugofs.NewCreateCountingFs(builder.Fs.PublishDir)

	sites, err := hugolib.NewHugoSites(deps.DepsCfg{
		Fs:      builder.Fs,
		Configs: builder.Cfg,
	})
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to create sites: %s", err))
		return fmt.Errorf("failed to create sites: %w", err)
	}
	builder.Sites = sites

	return nil
}

// Runs a standard Hugo build into our in-memory "public" directory
func (builder *bookshopSiteBuilder) build(cfg hugolib.BuildCfg) error {
	if builder.Sites == nil {
		builder.CreateSites()
	}

	err := builder.Sites.Build(cfg, builder.changeEvents()...)

	if err == nil {
		logErrorCount := builder.Sites.NumLogErrors()
		if logErrorCount > 0 {
			err = fmt.Errorf("logged %d errors", logErrorCount)
		}
	}
	if err != nil {
		fmt.Errorf("Build failed: %s", err)
		fmt.Println(fmt.Sprintf("Build failed: %s", err))
		return err
	}
	return nil
}

// Writes content to the given file path in the in-memory filesystem
func (builder *bookshopSiteBuilder) writeFile(filename, content string) {
	if err := afero.WriteFile(builder.Afs, filepath.FromSlash(filename), []byte(content), 0755); err != nil {
		fmt.Println(fmt.Sprintf("Failed to write file: %s", err))
	}

	builder.changedFiles = append(builder.changedFiles, filename)
}

// Reads content from the given file path in the in-memory filesystem
func (builder *bookshopSiteBuilder) readFile(filename string) string {
	b, err := afero.ReadFile(builder.Afs, filepath.Clean(filename))
	if err != nil {
		fmt.Println(fmt.Sprintf("Failed to read file: %s", err))
	}
	return string(b)
}

// Helper method to list out any files in our virtual fs
func (builder *bookshopSiteBuilder) debugDir(dir string) {
	files, err := afero.ReadDir(builder.Afs, dir)
	if err == nil {
		for _, file := range files {
			fmt.Println(fmt.Sprintf("%s > %+v", dir, file.Name()))
		}
	} else {
		fmt.Println(fmt.Sprintf("Error debugging directory: %+v", err))
	}
}

func (builder *bookshopSiteBuilder) changeEvents() []fsnotify.Event {
	var events []fsnotify.Event

	for _, v := range builder.changedFiles {
		events = append(events, fsnotify.Event{
			Name: v,
			Op:   fsnotify.Write,
		})
	}

	return events
}

var builder bookshopSiteBuilder
var build_config hugolib.BuildCfg

func main() {
	afs := afero.NewMemMapFs()
	builder = bookshopSiteBuilder{Afs: afs}
	builder.LoadConfig()
	build_config = hugolib.BuildCfg{
		NoBuildLock: true,
	}

	log.SetOutput(ioutil.Discard)

	c := make(chan struct{}, 0)
	js.Global().Set("initHugoConfig", js.FuncOf(initHugoConfig))
	js.Global().Set("writeHugoFiles", js.FuncOf(writeHugoFiles))
	js.Global().Set("readHugoFiles", js.FuncOf(readHugoFiles))
	js.Global().Set("buildHugo", js.FuncOf(buildHugo))
	<-c
}

func initHugoConfig(this js.Value, args []js.Value) interface{} {
	if err := builder.LoadConfig(); err != nil {
		fmt.Println(fmt.Sprintf("failed to load config: %s", err))
		return fmt.Errorf("failed to load config: %w", err)
	}
	if err := builder.CreateSites(); err != nil {
		fmt.Println(fmt.Sprintf("failed to create sites: %s", err))
		return fmt.Errorf("failed to create sites: %w", err)
	}
	return nil
}

func writeHugoFiles(this js.Value, args []js.Value) interface{} {
	var writeFiles map[string]string
	err := json.Unmarshal([]byte(args[0].String()), &writeFiles)
	if err != nil {
		fmt.Println(fmt.Sprintf("Bad json: %+v", err))
		return nil
	}

	for file_name, file_contents := range writeFiles {
		builder.writeFile(file_name, file_contents)
	}
	return nil
}

func readHugoFiles(this js.Value, args []js.Value) interface{} {
	var readFiles []string
	err := json.Unmarshal([]byte(args[0].String()), &readFiles)
	if err != nil {
		fmt.Println(fmt.Sprintf("Bad json: %+v", err))
		return nil
	}

	fileContents := make(map[string]interface{})
	for _, file_name := range readFiles {
		fileContents[file_name] = builder.readFile(file_name)
	}

	return js.ValueOf(fileContents)
}

func buildHugo(this js.Value, args []js.Value) interface{} {
	if err := builder.build(build_config); err != nil {
		return fmt.Sprintf("Build error: %+v", err)
	}
	return nil
}
