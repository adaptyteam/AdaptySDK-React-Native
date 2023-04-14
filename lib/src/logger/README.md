# Logging in `react-native-adapty`

Adapty React Native SDK have a fixed similar flow for all the public methods. This allows to have identical logging scopes, that would allow to easily trace problems in developer's flow or within SDK.

While this library provides extended logging capabilities, there is currently no way to output native logs to the console.

![](https://user-images.githubusercontent.com/16625670/231397794-aa6b3dd6-8da3-4207-80d9-87190c8c473a.png)

## Enabling
To enable logging, you need to set `AdaptyLogLevel` during initialization of the SDK.
```ts
import { LogLevel } from 'react-native-adapty';

adapty.activate('YOUR_SDK_KEY', {
  logLevel: LogLevel.VERBOSE,
})
```

## Log levels
Logs in `react-native-adapty` follow the same pattern:

1. (VERBOSE) `"Doing...."` right after the method is called
2. (VERBOSE) `"Doing: OK"` right before the method returns
3. (ERROR) `"Doing: FAILED"` right before the method returns with an error

### DEBUG logs
Most of the logs are debug logs. They are not printed by default, but can be enabled by setting `AdaptyLogLevel` to `AdaptyLogLevelDebug` in `Adapty.setLogLevel` method.

- `Calling "${METHOD_NAME}"` — when the public method is called
- `Encoding object` — when SDK needs to pass the value to the native layer (e.g. `Adapty.updateProfile`), it needs to encode user input to JSON string. This log is printed right before the encoding.
- `Decoding string` — when native layer returns a value to the SDK, this value needs to be decoded from JSON string to a native object. This log is printed right before the decoding.

And one more log set for event listeners flow:
- `Adding event listener "${EVENT_NAME}"` — when the event listener is added
- `Removing event listeners` — when event listeners are removed
- `Receiving event "${EVENT_NAME}"` — when the event is received

### INFO logs
`react-native-adapty` currently does not have any info logs.

## Warn logs
`react-native-adapty` currently does not have any warn logs.

### ERROR logs
Errors logs occur only with unxpected errors. This means, that `paywall_not_found` error would not be logged by Adapty, whereas unexpected type while decoding response of a paywall would result in an error log.

Error logs include call stack to trace down the error. 

### FATAL logs
`react-native-adapty` currently does not have any fatal logs. 