import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
// import { format } from 'date-fns'; // Will be implemented without external dependency

interface JsLog {
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'log';
  message: string;
  funcName: string;
  args: any[];
  isoDate: string;
}

interface LogsProps {
  logs: JsLog[];
  navigation: any;
}

const Logs: React.FC<LogsProps> = ({ logs, navigation }) => {
  return (
    <ScrollView>
      <View style={styles.gap} />
      <Group title={`${logs.length} logs (Newest first)`}>
        {logs
          .slice()
          .reverse()
          .map((log, index) => (
            <LineLog
              key={index}
              log={log}
              onPress={() => {
                console.log('OPEN LOG', log);
                navigation.navigate('LogPayload', { log });
              }}
              isFirst={index === 0}
              isLast={index === logs.length - 1}
            />
          ))}
      </Group>
    </ScrollView>
  );
};

interface LineLogProps {
  log: JsLog;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
}

const LineLog: React.FC<LineLogProps> = ({ log, isFirst, isLast, onPress }) => {
  const renderIcon = () => {
    return (
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🐞</Text>
      </View>
    );
  };

  return (
    <Line
      bordered={!isLast}
      topRadius={isFirst}
      bottomRadius={isLast}
      onPress={onPress}
    >
      <View style={styles.lineContainer}>
        {renderIcon()}
        <View style={styles.bodyContainer}>
          <View style={styles.logHeader}>
            <Text style={styles.funcNameText}>{log.funcName}</Text>
            <Text style={styles.timestampText}>{formatDate(log.isoDate)}</Text>
          </View>
          <Text>{log.message}</Text>
        </View>
      </View>
    </Line>
  );
};

function formatDate(date: string): string {
  try {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const milliseconds = d.getMilliseconds().toString().padStart(3, '0');

    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  } catch {
    return '-';
  }
}

const styles = StyleSheet.create({
  gap: { height: 20 },
  lineContainer: { flexDirection: 'row', alignItems: 'center' },
  bodyContainer: { flexGrow: 1 },
  iconContainer: {
    marginRight: 10,
    flexShrink: 0,
  },
  icon: {
    fontSize: 20,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  funcNameText: {
    color: '#666',
    fontSize: 13,
  },
  timestampText: { fontSize: 13, color: '#999' },
});

export default Logs;
