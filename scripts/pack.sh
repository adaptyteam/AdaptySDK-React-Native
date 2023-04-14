path="examples/SubscriptionsJS/node_modules/react-native-adapty"

yarn build --noEmit
npm pack

tar -xf react-native-adapty-*.tgz
rm -rf react-native-adapty-*.tgz

rm -rf $path # remove old version
mv package $path
rm -rf package
