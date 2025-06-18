import React from 'react';
import { ScrollView, Text, StyleSheet, View, Platform } from 'react-native';
import { Group } from '../components/Group';
import { Line } from '../components/Line';

interface JsLog {
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'log';
  message: string;
  funcName: string;
  args: any[];
  isoDate: string;
}

interface LogPayloadProps {
  route: {
    params: {
      log: JsLog;
    };
  };
}

const LogPayload: React.FC<LogPayloadProps> = ({ route }) => {
  const { log } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gap} />
      <Group title="Log Details">
        <Line topRadius>
          <View style={styles.row}>
            <Text style={styles.label}>Function:</Text>
            <Text style={styles.value}>{log.funcName}</Text>
          </View>
        </Line>
        <Line bordered>
          <View style={styles.row}>
            <Text style={styles.label}>Level:</Text>
            <Text style={[styles.value, styles[log.logLevel]]}>
              {log.logLevel.toUpperCase()}
            </Text>
          </View>
        </Line>
        <Line bordered>
          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{log.isoDate}</Text>
          </View>
        </Line>
        <Line bordered bottomRadius>
          <View style={styles.column}>
            <Text style={styles.label}>Message:</Text>
            <Text style={[styles.value, styles.messageText]}>
              {log.message}
            </Text>
          </View>
        </Line>
      </Group>

      {log.args.length > 1 && (
        <Group title="Arguments">
          <Line topRadius bottomRadius>
            <Text style={styles.argsText}>
              {JSON.stringify(log.args.slice(1), null, 2)}
            </Text>
          </Line>
        </Group>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7FF',
  },
  gap: {
    height: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  messageText: {
    textAlign: 'left',
    marginTop: 8,
  },
  argsText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
  },
  error: {
    color: '#FF3B30',
  },
  warn: {
    color: '#FF9500',
  },
  info: {
    color: '#007AFF',
  },
  debug: {
    color: '#5856D6',
  },
  log: {
    color: '#333',
  },
});

export default LogPayload;
