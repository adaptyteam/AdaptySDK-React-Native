# Logger

react-native-adapty logs its JS layer through the `@adapty/core` logger. Native SDK logs go to Xcode / os_log (iOS) and logcat (Android) and are configured by the same `setLogLevel` call. Sinks receive JS-layer SDK logs only; native SDK logs stay in Xcode / os_log and logcat.

## Levels

`error` < `warn` < `info` < `verbose`. JS logs are disabled until a level is set via `adapty.setLogLevel(...)` or `logLevel` in `adapty.activate(...)`. A level set before `activate` is kept when `activate` gets no `logLevel`. The new level applies immediately, including to the `setLogLevel` call itself.

## Sinks

Every JS log entry is a `LogEvent` (`level`, `funcName`, `message`, `params`, `timestamp`, `formatted`) delivered to each configured sink. The default sink is `consoleLogSink`.

```ts
import { adapty, consoleLogSink, type LogSink } from 'react-native-adapty';

const memorySink: LogSink = {
  id: 'memory',
  handle: event => store.push(event),
};

await adapty.setLogLevel('verbose', {
  logger: { sinks: [consoleLogSink, memorySink] },
});
```

- `logger.sinks` replaces all current sinks and calls `destroy()` on the old ones.
- Without `logger` in the options, the current sinks are kept.
- `logger` also resets `defaultMeta`, so pass it again each time.
- To change only the level, omit `logger`. Re-passing the same sinks object destroys and re-installs them.
- A sink may limit itself with `levels: ['error', 'warn']`.
- Errors thrown from a sink's `handle` are ignored; `destroy` must not throw.
- Import logger APIs (`consoleLogSink`, `LogSink`, …) from `react-native-adapty`, not from `@adapty/core`. Metro may resolve a direct `@adapty/core` import to a different module instance than the one the SDK uses.
- In Expo Go / mock mode, `setLogLevel` called before `activate` needs `enableMock()` first, like any other pre-activation call.
