cd tpl
HUGO_LOC="../../../../../../../Scratchpad/hugo/tpl"

# Check Hugo loc
if [ ! -d $HUGO_LOC ]; then
    echo "ERROR: hugo repo does not exist (on Liam's machine)"
    exit 1
fi

for LOCAL_FILE in **/*.go; do
    if [[ ! $LOCAL_FILE == *bookshop* ]]; then
        HUGO_FILE="$HUGO_LOC/$LOCAL_FILE"
        if [ ! -f $HUGO_FILE ]; then
            echo "WARN: File $LOCAL_FILE doesn't exist in Hugo as $HUGO_FILE"
        else
            cp $HUGO_FILE $LOCAL_FILE
        fi
    fi
done