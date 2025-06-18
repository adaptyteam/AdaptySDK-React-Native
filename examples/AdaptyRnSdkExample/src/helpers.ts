import { useState, useEffect } from 'react';

// Interface for JS logs
export interface JsLog {
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  funcName: string;
  args: any[];
  isoDate: string;
}

// readCredentials handles generated credentials
// This function is only for this example
export async function readCredentials(): Promise<string | undefined> {
  try {
    const credentials = await import('../.adapty-credentials.json');
    return credentials.token;
  } catch (error) {
    console.error(
      "[ADAPTY] Failed to read Adapty credentials. Please, follow the instructions in the example's README.md file to proceed.",
    );

    console.error(error);
    return undefined;
  }
}

type ConsoleKey = keyof typeof console;
type Console = Record<ConsoleKey, any>;

const consoleMethods: Array<JsLog['logLevel']> = [
  'debug',
  'info',
  'warn',
  'error',
];

// useJsLogs pipes JS logs to the state of the component
export function useJsLogs(): JsLog[] {
  const [logs, setLogs] = useState<JsLog[]>([]);

  useEffect(() => {
    // Store the original console methods
    const originalConsoleMethods = consoleMethods.reduce<Console>(
      (acc, method) => {
        const methodKey = method as ConsoleKey;
        acc[methodKey] = console[methodKey];

        return acc;
      },
      {} as Console,
    );

    // Override console method
    const overrideConsoleMethod = (method: ConsoleKey): void => {
      (console as Console)[method] = (...args: any[]) => {
        // Call the original console method
        originalConsoleMethods[method](...args);
        // Append the new log to the state, if it is adapty related
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[adapty')) {
          const msg = args[0].split(' ');
          // msg format `[${now}] [adapty@${version}] "${funcName}": ${message}`;
          // extract isoDate, funcName, message
          const isoDate = msg[0].replace('[', '').replace(']', '');
          const funcName = msg[2].replace('"', '').replace('":', '');
          const message = msg.slice(3).join(' ');

          setLogs(prevLogs => [
            ...prevLogs,
            { logLevel: method as any, message, isoDate, funcName, args },
          ]);
        }
      };
    };

    // Apply the override to all console methods
    consoleMethods.forEach(overrideConsoleMethod);

    // Restore the original console methods when the component is unmounted
    return () => {
      consoleMethods.forEach(method => {
        console[method] = originalConsoleMethods[method];
      });
    };
  }, []);

  return logs;
}

export function dateFormat(data: Date | number | undefined): string {
  if (!data) return '-';
  
  const date = new Date(data);
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
