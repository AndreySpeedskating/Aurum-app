import { FC } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text } from '@ant-design/react-native';
import React from 'react';

import { styles } from './styles';

type PropTypes = {
  onPress: () => void;
  icon: ImageSourcePropType;
  title: string;
  description: string;
  containerStyle: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

const Card: FC<PropTypes> = ({
  onPress,
  icon,
  title,
  description,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => (
  <Pressable onPress={onPress} style={[styles.container, containerStyle]}>
    <Image style={{ width: 37, height: 37 }} source={icon} />
    <Text style={[styles.title, titleStyle]}>{title}</Text>
    <Text style={[styles.description, descriptionStyle]}>{description}</Text>
  </Pressable>
);

export default Card;
