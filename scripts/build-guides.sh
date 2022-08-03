#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR/../guides

if [ -z $1 ]; then
    MODIFIED=$(git diff HEAD --name-only --exit-code .)
    MODIFIED_COUNT=$(echo $MODIFIED | sed 's/ / \n/g' | grep -c 'adoc')

    echo "$MODIFIED_COUNT file(s) modified"
    echo $MODIFIED
    echo ""

    if [ $MODIFIED_COUNT != "1" ]; then
        echo "Can't proceed."
        echo "Run ./build-guides.sh <ssg> to force one file over the others."
        exit 1
    fi

    SOURCE=$(echo $MODIFIED | sed 's/guides/./')
else
    SOURCE="./$1.adoc"
fi

echo "Copying changes from $SOURCE to other SSG guides"

read -p "Proceed? y/N " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then

build_guide () {
    SSG=$1
    SSGL=$(echo "$SSG" | tr '[:upper:]' '[:lower:]')
    SSGENG=$2
    SSGEXT=$3

    if [[ ! $SOURCE =~ $SSGL ]]; then
    sed -E "s/:.+: ssg/:${SSGL}: ssg/; s/:ssg: .+/:ssg: ${SSG}/; s/:ssgl: .+/:ssgl: ${SSGL}/; s/:ssgeng: .+/:ssgeng: ${SSGENG}/; s/:ssgext: .+/:ssgext: ${SSGEXT}/" $SOURCE > ../guides/$SSGL.adoc
    echo "Wrote $SSGL.adoc"
    else
    echo "Skipped $SSGL.adoc (source file)"
    fi
}

build_guide "Eleventy" "eleventy" "eleventy.liquid"
build_guide "Jekyll" "jekyll" "jekyll.html"
build_guide "Hugo" "hugo" "hugo.html"
build_guide "SvelteKit" "svelte" "svelte"

echo "Done!"
exit 0

fi

echo "No actions performed."
exit 0