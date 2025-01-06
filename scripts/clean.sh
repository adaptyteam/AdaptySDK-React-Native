watchman watch-del-all || true
adb reverse tcp:8081 tcp:8081 || true

rm -rf dist

rm -rf example/ios/DerivedData
rm -rf ios/DerivedData

rm -rf example/android/app/build
rm -rf android/app/build

rm -rf android/build
rm -rf example/android/build

yarn cache clean