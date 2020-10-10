watchman watch-del-all || true
adb reverse tcp:8081 tcp:8081 || true

rm -rf lib/dist

rm -rf example/ios/DerivedData
rm -rf lib/ios/DerivedData

rm -rf example/android/app/build
rm -rf lib/android/app/build

rm -rf lib/android/build
rm -rf example/android/build

yarn cache clean