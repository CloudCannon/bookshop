#!/bin/bash

TMPFILENAME="hugo_renderer_$(date +%s).wasm"
OUTPUTFILENAME="hugo_renderer.wasm"

# Clean
rm -f $OUTPUTFILENAME
if [ -f $OUTPUTFILENAME ]; then
    echo "ERROR: previous $OUTPUTFILENAME still in directory"
    exit 1
fi
rm -f $OUTPUTFILENAME.gz
if [ -f $OUTPUTFILENAME.gz ]; then
    echo "ERROR: previous $OUTPUTFILENAME.gz still in directory"
    exit 1
fi

# Build temp module (For Windows use `$Env:GOOS = "js"; $Env:GOARCH = "wasm"` )
GOOS=js GOARCH=wasm go build -tags nodeploy -o $TMPFILENAME
printf "Built Hugo WASM via $TMPFILENAME : "
ls -lh $TMPFILENAME | awk '{print $5}'

# Link module
mv $TMPFILENAME $OUTPUTFILENAME
if [ ! -f $OUTPUTFILENAME ]; then
    echo "ERROR: hugo_renderer.wasm not complete"
    exit 1
fi
printf "Hugo WASM available at $OUTPUTFILENAME : "
ls -lh $OUTPUTFILENAME | awk '{print $5}'

gzip --keep $OUTPUTFILENAME
printf "Compressed Hugo WASM available at $OUTPUTFILENAME.gz : "
ls -lh $OUTPUTFILENAME.gz | awk '{print $5}'
