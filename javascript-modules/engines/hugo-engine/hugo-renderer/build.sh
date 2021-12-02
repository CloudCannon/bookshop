rm -f hugo_renderer.wasm
GOOS=js GOARCH=wasm go build -tags nodeploy -o hugo_renderer.wasm
printf "Built Hugo WASM at "
ls -lh hugo_renderer.wasm | awk '{print $5}'