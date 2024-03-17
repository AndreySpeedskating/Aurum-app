import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { GestureResponderEvent } from 'react-native';
import ErrorWrapper from '../errorBoundary/ErrorBoundary';
import { useAuthStore } from '../../state/auth';

type PropTypes = {
  children: any;
  onPress?: (event: GestureResponderEvent) => void;
  navigation: any;
};

const Container = ({ navigation, children, onPress }: PropTypes) => {
  const { jwt, _hasHydrated } = useAuthStore((store) => store);
  useEffect(() => {
    if (_hasHydrated && !jwt && navigation) {
      navigation.replace('Login');
    }
  }, [_hasHydrated, jwt, navigation]);

  return (
    <ErrorWrapper>
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}>
        {children}
      </Pressable>
    </ErrorWrapper>
  );
};

export default Container;
