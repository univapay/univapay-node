#!/usr/bin/env sh

LIB_DIR="lib"
ES6_DIR="es"

_colorGreen() {
    echo "\033[0;32m$1\033[0m"
}
_copyFiles() {
    local DIR=`dirname $0`

    cp -rf CHANGELOG.md LICENSE "$1" \
      && if [ $1 == $ES6_DIR ]
         then
             cp -rf README_ES.md "$1/README.md"
         else
             cp -rf README.md "$1"
         fi \
      && node "$DIR/build.js" "$1"
}

echo "Building module"

# Build ES5 version
echo " => CommonJS Build" \
  && rm -rf $LIB_DIR \
  && tsc \
    --outDir $LIB_DIR \
    --noEmit false \
    --target es5 \
    --module commonjs \
  && _copyFiles $LIB_DIR

# Build ES6 version
echo " => ES6 Build" \
  && rm -rf $ES6_DIR \
  && tsc \
    --outDir $ES6_DIR \
    --noEmit false \
    --target es5 \
    --module es2015 \
  && _copyFiles $ES6_DIR
