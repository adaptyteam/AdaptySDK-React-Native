import {useState, useEffect} from 'react';
import format from 'date-fns/format';

// readCredentials handles generated credentials
// This function is only for this example
export async function readCredentials() {
  try {
    const credentials = await import('./.adapty-credentials.json');
    return credentials.token;
  } catch (error) {
    console.error(
      "[ADAPTY] Failed to read Adapty credentials. Please, follow the instructions in the example's README.md file to proceed.",
    );

    console.error(error);
  }
}

// interface JsLog {
//   logLevel: 'error' | 'warn' | 'info' | 'debug';
//   message: string;
//   funcName: string;
//   args: any[];
//   isoDate: string;
// }

// useJsLogs pipes JS logs to the state of the component
export function useJsLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const consoleMethods = ['log', 'debug', 'info', 'warn', 'error'];

    // Store the original console methods
    const originalConsoleMethods = consoleMethods.reduce((acc, method) => {
      acc[method] = console[method];
      return acc;
    }, {});

    // Override console method
    const overrideConsoleMethod = method => {
      console[method] = (...args) => {
        // Call the original console method
        originalConsoleMethods[method](...args);
        // Append the new log to the state, if it is adapty related
        if (args[0].includes('[adapty')) {
          const msg = args[0].split(' ');
          // msg format `[${now}] [adapty@${version}] "${funcName}": ${message}`;
          // extract isoDate, funcName, message
          const isoDate = msg[0].replace('[', '').replace(']', '');
          const funcName = msg[2].replace('"', '').replace('":', '');
          const message = msg.slice(3).join(' ');

          setLogs(prevLogs => [
            ...prevLogs,
            {logLevel: method, message, isoDate, funcName, args},
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

export function dateFormat(data) {
  return data ? format(data, 'dd MMM yyyy, hh:mm:ss aa') : '-';
}
