import { consoleLogSink } from '@/index';
import type { LogEvent, LogSink, LoggerConfig } from '@/index';

describe('public logger exports', () => {
  it('exposes consoleLogSink and the logger types', () => {
    const sink: LogSink = { id: 'custom', handle: (_event: LogEvent) => {} };
    const config: LoggerConfig = { sinks: [consoleLogSink, sink] };

    expect(consoleLogSink.id).toBe('console');
    expect(config.sinks).toHaveLength(2);
  });
});
