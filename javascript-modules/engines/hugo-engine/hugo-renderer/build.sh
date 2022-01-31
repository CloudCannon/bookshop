rm -f hugo_renderer.wasm
FILENAME="hugo_renderer_$(date +%s).wasm"
GOOS=js GOARCH=wasm go build -tags nodeploy -o $FILENAME
printf "Built Hugo WASM via $FILENAME : "
ls -lh $FILENAME | awk '{print $5}'
if [ -f hugo_renderer.wasm ]; then
    echo "ERROR: previous hugo_renderer.wasm still in directory"
    exit 1
fi
mv $FILENAME hugo_renderer.wasm
if [ ! -f hugo_renderer.wasm ]; then
    echo "ERROR: hugo_renderer.wasm not complete"
    exit 1
fi
echo "Done. Hugo WASM available at hugo_renderer.wasm"
exit 0