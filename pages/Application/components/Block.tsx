import { View, Text } from '@ant-design/react-native';
import React from 'react';
import { FC, ReactElement } from 'react';

import { styles } from './styles';

type PropTypes = {
  children: ReactElement | ReactElement[];
  title: string;
};

const Block: FC<PropTypes> = ({ children, title }) => (
  <View style={styles.block}>
    <Text style={styles.blockTitle}>{title}</Text>
    {children}
  </View>
);

export default Block;
