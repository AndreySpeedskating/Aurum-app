import React, { ReactElement } from 'react';
import { View, Text, Button } from 'react-native';

const Fallback = (props: { error: Error; resetError: any }) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      padding: 24,
    }}>
    <Text>Критическая ошибка</Text>
    <Text>{props.error.toString()}</Text>
    <Button onPress={props.resetError} title={'Обновить страницу'} />
  </View>
);

export default Fallback;
