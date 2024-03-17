import { useState, forwardRef, useMemo } from 'react';
import { Button, InputItem, Text, View } from '@ant-design/react-native';
import { InputItemProps } from '@ant-design/react-native/lib/input-item';
import React from 'react';
import { mainTheme } from '../../theme';
import { Image, KeyboardTypeOptions, StyleSheet } from 'react-native';
import { eye, eyeStrike } from '../icons';

type PropTypes = InputItemProps & {
  onBlurCb?: () => void;
  title?: string;
  isPassword?: boolean;
  hasError?: boolean;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'column',
    gap: 4,
    width: '80%',
  },
  label: {
    marginLeft: 16,
  },
  eyeButton: {
    position: 'absolute',
    width: 24,
    height: 16,
    bottom: 18,
    right: 20,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});

const Input = forwardRef<InputItem, PropTypes>((props, ref) => {
  const {
    isPassword,
    value,
    onChange,
    onSubmitEditing,
    title,
    onKeyPress,
    type = 'text',
    inputMode,
    placeholder,
    onBlurCb,
    hasError,
  } = props;
  const [inputType, setInputType] = useState<
    'number' | 'text' | 'bankCard' | 'phone' | 'password' | 'digit' | KeyboardTypeOptions
  >(type);
  const [focus, setFocus] = useState(false);

  const inputStyle = useMemo(() => {
    const input = StyleSheet.create({
      input: {
        width: '100%',
        minHeight: 42,
        borderRadius: 8,
        borderWidth: 1,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 32,
        borderColor: mainTheme.brand_primary_tap,
      },
    });
    if (focus) {
      input.input.borderColor = mainTheme.brand_primary;
    }
    if (hasError === true) {
      input.input.borderColor = mainTheme.brand_error;
    }
    return input.input;
  }, [focus, hasError]);

  const changeInputType = (): void => {
    setInputType((prev) => (prev === 'password' ? 'number' : 'password'));
  };

  const onInputFocus = (): void => {
    setFocus(true);
  };

  const onInputBlur = (): void => {
    setFocus(false);
    onBlurCb?.();
  };

  return (
    <View style={styles.inputWrapper}>
      {title && <Text style={styles.label}>{title}</Text>}
      <InputItem
        ref={ref}
        labelPosition="top"
        style={inputStyle}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        type={inputType}
        onKeyPress={onKeyPress}
        selectionColor={mainTheme.color_text_base}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onChange={onChange}
        onSubmitEditing={onSubmitEditing}
      />
      {isPassword && (
        <Button onPress={changeInputType} style={styles.eyeButton}>
          <Image source={inputType === 'password' ? eye : eyeStrike} />
        </Button>
      )}
    </View>
  );
});

export default Input;
