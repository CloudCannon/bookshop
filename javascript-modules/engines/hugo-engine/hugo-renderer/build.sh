TMPFILENAME="hugo_renderer_$(date +%s).wasm"
OUTPUTFILENAME="hugo_renderer.wasm"

# Clean
rm -f $OUTPUTFILENAME
if [ -f $OUTPUTFILENAME ]; then
    echo "ERROR: previous $OUTPUTFILENAME still in directory"
    exit 1
fi

# Build temp module (For Windows use `$Env:GOOS = "js"; $Env:GOARCH = "wasm"` )
GOOS=js GOARCH=wasm go build -tags nodeploy -o $TMPFILENAME
printf "Built Hugo WASM via $TMPFILENAME : "
ls -lh $TMPFILENAME | awk '{print $5}'

# Link repo module
mv $TMPFILENAME $OUTPUTFILENAME
if [ ! -f $OUTPUTFILENAME ]; then
    echo "ERROR: hugo_renderer.wasm not complete"
    exit 1
fi
echo "Done. Repo Hugo WASM available at hugo_renderer.wasm"

# If we're just in a test run we don't want to touch the CDN repo
if [[ -z "${PUBLISH_BOOKSHOP_CDN}" ]]; then
    echo "Not publishing to CDN."
    exit 0
fi

if [[ -z "${BOOKSHOP_VERSION}" ]]; then
    echo "ERROR: BOOKSHOP_VERSION environment variable does not exist"
    exit 1
fi

CDNFILENAME="../../../../../bookshopcdn/hugo/hugo_renderer_$BOOKSHOP_VERSION.wasm"

# Check CDN
if [ ! -d ../../../../../bookshopcdn/hugo ]; then
    echo "ERROR: bookshopcdn repo does not exist alongside bookshop repo"
    exit 1
fi

# Link CDN module
cp $OUTPUTFILENAME $CDNFILENAME
if [ ! -f $CDNFILENAME ]; then
    echo "ERROR: $CDNFILENAME not complete"
    exit 1
fi
echo "Done. CDN Hugo WASM available at $CDNFILENAME"

cd ../../../../../bookshopcdn

git add -A \
&& git commit -m "build: releasing $BOOKSHOP_VERSION" \
&& git tag -a v$BOOKSHOP_VERSION -m "build: releasing $BOOKSHOP_VERSION" \
&& git push --tags && git push

exit 0