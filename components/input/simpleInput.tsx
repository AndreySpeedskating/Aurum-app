import { useState, forwardRef, useMemo } from 'react';
import { InputItem, View } from '@ant-design/react-native';
import { InputItemProps } from '@ant-design/react-native/lib/input-item';
import React from 'react';
import { mainTheme } from '../../theme';
import { Image, Pressable, StyleSheet } from 'react-native';
import { close } from '../icons/index';
import { styles } from './styles';

type PropTypes = InputItemProps & {
  onBlurCb?: () => void;
  onFocusCb?: () => void;
  title?: string;
  isPassword?: boolean;
  hasError?: boolean;
  onClear?: () => void;
};

const SimpleInput = forwardRef<InputItem, PropTypes>((props, ref) => {
  const {
    value,
    onChange,
    onSubmitEditing,
    onKeyPress,
    type = 'text',
    inputMode,
    placeholder,
    onBlurCb,
    onFocusCb,
    hasError,
    disabled,
    onClear,
  } = props;
  const [focus, setFocus] = useState(false);

  const inputStyle = useMemo(() => {
    const input = StyleSheet.create({
      input: {
        flex: 1,
        minWidth: '100%',
        minHeight: 42,
        borderRadius: 4,
        borderWidth: 1,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 12,
        paddingRight: 32,
        marginLeft: -14,
        borderColor: mainTheme.neutral_200,
        fontSize: 14,
        shadowOpacity: 0,
      },
    });
    if (focus) {
      input.input.borderColor = mainTheme.brand_primary;
    }
    if (hasError) {
      input.input.borderColor = mainTheme.brand_error;
    }
    return input.input;
  }, [focus, hasError]);

  const onInputFocus = (): void => {
    setFocus(true);
    onFocusCb?.();
  };

  const onInputBlur = (): void => {
    setFocus(false);
    onBlurCb?.();
  };

  const onClearPress = (): void => {
    onChange?.('');
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
      <InputItem
        ref={ref}
        last
        labelPosition="top"
        disabled={disabled}
        style={[inputStyle]}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
        onKeyPress={onKeyPress}
        selectionColor={mainTheme.color_text_base}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onChange={onChange}
        onSubmitEditing={onSubmitEditing}
      />
      {value && value?.length > 1 && (
        <Pressable onPress={onClearPress} style={styles.clearButton}>
          <Image style={{ width: 16, height: 16 }} source={close} />
        </Pressable>
      )}
    </View>
  );
});

export default SimpleInput;
