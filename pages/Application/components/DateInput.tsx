import { Text } from '@ant-design/react-native';
import React, { ReactElement } from 'react';
import { FC } from 'react';

import { calendar, clock } from '../../../components/icons';
import { styles } from './styles';
import { Image, Pressable } from 'react-native';
import { mainTheme } from '../../../theme';

type PropTypes = {
  title: string;
  children?: ReactElement | null;
  onPress?: () => void;
  type?: 'date' | 'time';
  active?: boolean;
  width?: string;
  hasError?: boolean;
};

const icons = {
  date: calendar,
  time: clock,
};

const DateInput: FC<PropTypes> = ({
  title,
  children,
  onPress,
  type = 'date',
  active,
  width,
  hasError,
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.input,
      { borderColor: active ? mainTheme.brand_primary : mainTheme.neutral_200 },
      { width },
      hasError && { borderColor: mainTheme.brand_error },
    ]}>
    <Image style={{ width: 16, height: 16 }} source={icons[type]} />
    <Text style={styles.inputText}>{title}</Text>
    {children}
  </Pressable>
);

export default DateInput;
