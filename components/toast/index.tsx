import { Button, View } from '@ant-design/react-native';
import React from 'react';
import { FC } from 'react';
import { Text, ViewStyle } from 'react-native';
import { styles } from './styles';

type PropTypes = {
  title: string;
  onClose: () => void;
  containerStyles?: ViewStyle;
};

const ToastContent: FC<PropTypes> = ({ title, onClose, containerStyles }) => (
  <View style={[styles.container, containerStyles]}>
    <Text style={styles.title}>{title}</Text>
    <Button onPress={onClose} style={styles.navButton}>
      <Text style={styles.title}>Закрыть</Text>
    </Button>
  </View>
);

export default ToastContent;
