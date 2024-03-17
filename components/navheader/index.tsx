import { Button, View } from '@ant-design/react-native';
import React from 'react';
import { FC } from 'react';
import { Image, Text, ViewStyle } from 'react-native';
import { arrowLeft } from '../icons';
import { styles } from './styles';

type PropTypes = {
  title: string;
  onNavClick: () => void;
  containerStyles?: ViewStyle;
};

const NavHeader: FC<PropTypes> = ({ title, onNavClick, containerStyles }) => (
  <View style={[styles.header, containerStyles]}>
    <Button onPress={onNavClick} style={styles.navButton}>
      <Image style={{ width: 16, height: 16 }} source={arrowLeft} />
    </Button>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default NavHeader;
