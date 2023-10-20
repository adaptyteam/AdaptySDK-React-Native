rn_app_dir="../react-native-app/pure-0.71/node_modules/react-native-adapty"
rn_ui_dir="../react-native-ui/node_modules/react-native-adapty"

yarn build
npm pack # yarn pack is extremely slow 

echo "Unzipping..."
tar -xf react-native-adapty-*.tgz
echo "Removing tarball..."
rm -rf react-native-adapty-*.tgz

echo "Removing previous lib..."
rm -rf $rn_app_dir # remove old version
rm -rf $rn_ui_dir # remove old version
echo "Moving to node_modules"
cp -r package $rn_app_dir
cp -r package $rn_ui_dir
echo "Removing package folder..."
rm -rf package
  