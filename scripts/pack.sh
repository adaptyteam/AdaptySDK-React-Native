path="examples/SubscriptionsJS/node_modules/react-native-adapty"

yarn build
npm pack

echo "Unzipping..."
tar -xf react-native-adapty-*.tgz
echo "Removing tarball..."
rm -rf react-native-adapty-*.tgz

echo "Removing previous lib..."
rm -rf $path # remove old version
echo "Moving to node_modules"
mv package $path
echo "Removing package folder..."
rm -rf package
  