import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';
import { Keyboard, GestureResponderEvent, ScrollView, Animated } from 'react-native';
import { Button, InputItem, Text, View, ActivityIndicator } from '@ant-design/react-native';
import { PageContainer, Input } from '../../components';
import { useAuthStore, setUser, resetUser } from '../../state/auth';
import api from '../../api';
import { mainTheme } from '../../theme';
import { v4 as uuidv4 } from 'uuid';
import { phoneFormatter, phoneValidation } from './helpers';
import { ErrorMessage } from './constants';
import { logo } from '../../components/icons';
import { styles } from './styles';
import { setUuid, useServiceStore } from '../../state/service';

type ErrorType = { phone: boolean; password: boolean; noUser: boolean; blocked: boolean };

const Login = ({ navigation }: any) => {
  const [form, setForm] = useState({ phone: '+7 ', password: '' });
  const { jwt } = useAuthStore((store) => store);
  const [loading, setLoading] = useState(false);
  const [keyboardShow, setKeyBoardShow] = useState(false);
  const [error, setError] = useState<ErrorType>({
    phone: false,
    password: false,
    noUser: false,
    blocked: false,
  });
  const logoAnimation = useRef<Animated.Value>(new Animated.Value(1));
  const inputLoginRef = useRef<InputItem>(null);
  const inputPasswordRef = useRef<InputItem>(null);

  const scaleDownLogo = () => {
    Animated.spring(logoAnimation.current, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start(() => {
      logoAnimation.current = new Animated.Value(0.5);
    });
  };

  const scaleUpLogo = () => {
    Animated.spring(logoAnimation.current, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      logoAnimation.current = new Animated.Value(1);
    });
  };

  const getDeviceInfo = async (): Promise<void> => {
    const savedUiid = await SecureStore.getItemAsync('secure_deviceid');
    if (savedUiid) {
      setUuid(`${savedUiid}`);
      return;
    }
    if (Application.androidId) {
      await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(Application.androidId));
      setUuid(`${Application.androidId}`);
      return;
    }
    const geteratedUuid = uuidv4();
    await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(geteratedUuid));
    setUuid(`${geteratedUuid}`);
  };

  useEffect(() => {
    if (jwt) {
      navigation.replace('Main');
    }
    getDeviceInfo();
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyBoardShow(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardShow(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardShow) {
      scaleDownLogo();
    } else {
      scaleUpLogo();
    }
  }, [keyboardShow]);

  const onPhoneChangeHandler = (text: string) => {
    if (error.phone && phoneValidation(phoneFormatter(text))) {
      setError((prev) => ({ ...prev, phone: false }));
    }
    setForm((prev) => ({ ...prev, phone: phoneFormatter(text) }));
  };

  const onPasswordChangeHandler = (text: string) => {
    setForm((prev) => ({ ...prev, password: text }));
  };

  const clickOutside = (event: GestureResponderEvent): void => {
    Keyboard.dismiss();
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    await api.auth
      .loginUser({ identifier: form.phone, password: form.password })
      .then(async (response) => {
        if (response?.jwt) {
          setUser(response);
          setTimeout(() => {
            navigation.replace('Main');
          }, 200);
        } else {
          setError((prev) => ({ ...prev, noUser: true }));
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
        setError((prev) => ({ ...prev, noUser: true }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onInputBlur = (): void => {
    if (!phoneValidation(form.phone)) {
      setError((prev) => ({ ...prev, phone: true }));
    }
  };

  const onLoginSubmitEnd = (): void => {
    if (!form.password && inputPasswordRef?.current) {
      inputPasswordRef.current.focus();
    }
  };

  const onPasswordSubmitEnd = (): void => {
    if (!form.phone && inputLoginRef?.current) {
      inputLoginRef.current.focus();
    }
    if (form.password && form.phone) {
      onSubmit();
    }
  };

  const onKeyPress = (e: any): void => {
    if (e.nativeEvent.key === 'Backspace') {
      const lastChar = form?.phone[form?.phone?.length - 1];
      if (lastChar === ')') {
        const value = form?.phone?.slice(0, form?.phone?.length - 2);
        setTimeout(() => {
          setForm((prev) => ({ ...prev, phone: value }));
        }, 10);
      }
    }
  };

  const getErrorMessage = (): string | undefined => {
    const messageKey = Object.keys(error)?.find((k) => (error as any)[k] === true);
    if (messageKey) {
      return (ErrorMessage as any)[messageKey];
    }
    return undefined;
  };

  return (
    <PageContainer onPress={clickOutside} navigation={undefined}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Animated.Image
            style={[styles.logo, { transform: [{ scale: logoAnimation.current }] }]}
            source={logo}
          />
          <Input
            id="login"
            key="login"
            title="Логин"
            hasError={error.phone || error.noUser}
            ref={inputLoginRef}
            labelPosition="top"
            value={form.phone}
            placeholder="Введите ваш телефон"
            inputMode="tel"
            type="text"
            onKeyPress={onKeyPress}
            selectionColor={mainTheme.color_text_base}
            onBlurCb={onInputBlur}
            onChange={onPhoneChangeHandler}
            onSubmitEditing={onLoginSubmitEnd}
          />
          <Input
            id="password"
            key="password"
            title="Пароль"
            isPassword
            hasError={error.noUser}
            ref={inputPasswordRef}
            value={form.password}
            placeholder="Введите ваш пароль"
            inputMode="numeric"
            type="password"
            selectionColor={mainTheme.color_text_base}
            onChange={onPasswordChangeHandler}
            onSubmitEditing={onPasswordSubmitEnd}
          />
          {getErrorMessage() && <Text style={styles.errorMessage}>{getErrorMessage()}</Text>}
          <Button
            onPress={onSubmit}
            disabled={!phoneValidation(form.phone) || form.password?.length < 4}
            style={styles.button}
            type="primary">
            Войти
          </Button>
        </View>
      </ScrollView>
      <ActivityIndicator animating={loading} toast size="large" />
    </PageContainer>
  );
};

export default Login;
