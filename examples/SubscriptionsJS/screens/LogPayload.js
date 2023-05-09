import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Group} from '../components/Group';
import {LineParam} from '../components/LineParam';
import {dateFormat} from '../helpers';
import {Line} from '../components/Line';

const LogPayload = props => {
  const log = props.route.params.log;

  if (!log) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No log</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <View style={styles.gap} />
        <Group title="INFO">
          <LineParam label="Level" bordered value={log.logLevel} />
          <LineParam
            label="DateTime"
            bordered
            value={dateFormat(new Date(log.isoDate))}
          />
          <LineParam label="Function" bordered value={log.funcName} />
          <LineParam label="Message" bordered value={log.message} />
        </Group>

        <Group title="ARGS" style={styles.darkGroup}>
          {log.args.map((arg, index) => (
            <Line key={index} bordered={index !== log.args.length - 1} dark>
              <Text style={styles.logText}>
                {typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)}
              </Text>
            </Line>
          ))}
        </Group>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gap: {height: 20},
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%',
  },
  errorText: {
    fontSize: 15,
    color: '#999',
    textTransform: 'uppercase',
  },
  darkGroup: {backgroundColor: '#141720'},
  logText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#fefefe',
  },
});
export default LogPayload;
