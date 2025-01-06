DIST="example/node_modules/react-native-adapty"
rm -rf $DIST
mkdir -p $DIST

ln -s ios $DIST/ios
ls -s android $DIST/android
ln -s node_modules $DIST/node_modules
ln -s src $DIST/src
ln -s react-native-adapty.podspec $DIST/react-native-adapty.podspec
ln -s tsconfig.json $DIST/tsconfig.json
ln -s package.json $DIST/package.json