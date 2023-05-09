import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Group} from '../components/Group';
import {Line} from '../components/Line';
import {format} from 'date-fns';
import {SFSymbol} from 'react-native-sfsymbols';

const Logs = ({logs, navigation}) => {
  return (
    <ScrollView>
      <View style={style.gap} />
      <Group title={`${logs.length} logs (Newest first)`}>
        {logs.reverse().map((log, index) => (
          <LineLog
            key={index}
            log={log}
            onPress={() => {
              console.log('OPEN LOG', log);
              navigation.navigate('LogPayload', {log});
            }}
            isFirst={index === 0}
            isLast={index === logs.length - 1}
          />
        ))}
      </Group>
    </ScrollView>
  );
};

const LineLog = ({log, isFirst, isLast, onPress}) => {
  const renderIcon = () => {
    return (
      <View style={style.iconContainer}>
        <SFSymbol
          name="ladybug"
          scale="medium"
          color="#4777FF"
          size={20}
          resizeMode="center"
          style={style.icon}
        />
      </View>
    );
  };

  return (
    <Line
      bordered={!isLast}
      topRadius={isFirst}
      bottomRadius={isLast}
      onPress={onPress}>
      <View style={style.lineContainer}>
        {renderIcon()}
        <View style={style.bodyContainer}>
          <View style={style.logHeader}>
            <Text style={style.funcNameText}>{log.funcName}</Text>
            <Text style={style.timestampText}>{formatDate(log.isoDate)}</Text>
          </View>
          <Text>{log.message}</Text>
        </View>
      </View>
    </Line>
  );
};

function formatDate(date) {
  return date ? format(new Date(date), 'HH:mm:ss:SSS') : '-';
}

const style = StyleSheet.create({
  gap: {height: 20},
  lineContainer: {flexDirection: 'row', alignItems: 'center'},
  bodyContainer: {flexGrow: 1},
  iconContainer: {
    marginRight: 10,
    flexShrink: 0,
  },
  icon: {
    width: 20,
    height: 20,
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
  timestampText: {fontSize: 13, color: '#999'},
});

export default Logs;
