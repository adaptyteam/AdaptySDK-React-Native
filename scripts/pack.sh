path="../react-native-app/pure-0.71/node_modules/react-native-adapty"

yarn build
npm pack # yarn pack is extremely slow 

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
  