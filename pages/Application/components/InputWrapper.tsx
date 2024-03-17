import { View, Text } from '@ant-design/react-native';
import React from 'react';
import { FC, ReactElement } from 'react';

import { styles } from './styles';

type PropTypes = {
  children: ReactElement;
  title: string;
  width?: number;
  hasError?: boolean;
};

const InputWrapper: FC<PropTypes> = ({ children, title, width, hasError }) => (
  <View style={[styles.container, { width }]}>
    {children}
    <Text style={[styles.title, hasError && styles.titleError]}>{title}</Text>
  </View>
);

export default InputWrapper;
