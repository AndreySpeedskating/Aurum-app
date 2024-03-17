import React, { ReactNode, useMemo, useRef } from 'react';
import { FC, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { mainTheme } from '../../theme';
import { styles } from './styles';
import { Image } from 'react-native';
import { arrowRight } from '../icons';
import { Text } from 'react-native';
import { Pressable } from 'react-native';
import SimpleInput from '../input/simpleInput';
import { Button, InputItem, Portal } from '@ant-design/react-native';
import { IAutoPark, ICargo, IConterpartieResponse } from '../../api/content/interface';

const windowWidth = Dimensions.get('screen').width;

type PropTypes = {
  data?: IAutoPark[] | ICargo[] | IConterpartieResponse[];
  name: string;
  title: string;
  hasError?: boolean;
  disabled?: boolean;
};

const Select: FC<
  PropTypes & { name: string; onSelectChange: (name: string, value: any) => void }
> = (props) => {
  const inputRef = useRef<InputItem>(null);
  const [data, setData] = useState<IAutoPark[] | ICargo[] | IConterpartieResponse[]>([]);
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { onSelectChange, name, disabled, title, hasError } = props;

  useEffect(() => {
    if (props.data?.length) {
      setData(props.data);
    }
  }, [props?.data]);

  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  const onChangeSearchInputText = (value: any): void => {
    setSearch(value);
  };

  const onFocus = (): void => {
    setFocus(true);
  };

  const onBlur = (): void => {
    setFocus(false);
  };

  const onShowSearch = (): void => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    setShowSearch(true);
  };

  const onSearchEnd = (): void => {
    const target = list?.find((c) => c?.name === search);
    const payload =
      ['loadingPoint', 'unLoadingPoint'].includes(name) && !target ? search : target?.id || '';
    onSelectChange(name, payload);
    const pointTextPayload = ['loadingPoint', 'unLoadingPoint'].includes(name) ? search : '';
    target ? onChangeSearchInputText(search) : onChangeSearchInputText(pointTextPayload);
    setShowSearch(false);
    setFocus(false);
  };

  const list = useMemo(
    () =>
      search
        ? data?.filter((item) => item?.name?.toLowerCase()?.includes(search?.toLowerCase()))
        : data,
    [data, search]
  );

  const Overlay = (): ReactNode =>
    list.map((item) => (
      <Pressable
        key={item.id}
        style={[styles.listItem]}
        onPress={() => onChangeSearchInputText(item?.name)}>
        <Text style={{ fontSize: 16 }}>{item?.name}</Text>
      </Pressable>
    ));

  const buttonStyle = useMemo(() => {
    return StyleSheet.create({
      style: {
        width: '100%',
        minHeight: 42,
        borderRadius: 4,
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        overflow: 'visible',
        fontSize: 14,
        borderColor: focus ? mainTheme.brand_primary : mainTheme.neutral_200,
        backgroundColor: disabled ? mainTheme.neutral_200 : 'transparent',
      },
    });
  }, [focus, disabled, hasError]);

  return (
    <Pressable
      onPress={disabled ? () => undefined : onShowSearch}
      style={[buttonStyle.style, hasError ? { borderColor: mainTheme.brand_error } : {}]}>
      <Text
        style={[
          { flex: 1, fontSize: 14 },
          hasError ? { color: mainTheme.brand_error } : { color: mainTheme.brand_primary },
        ]}>
        {search}
      </Text>
      {showSearch && (
        <Portal>
          <View style={styles.container}>
            <Text>{title}</Text>
            <View style={styles.inputRow}>
              <View style={{ width: windowWidth - 104 }}>
                <SimpleInput
                  ref={inputRef}
                  value={search}
                  onChange={onChangeSearchInputText}
                  onBlurCb={onBlur}
                  onFocusCb={onFocus}
                  onSubmitEditing={onSearchEnd}
                />
              </View>
              <Button onPress={onSearchEnd} style={styles.back}>
                <Image style={{ width: 24, height: 24 }} source={arrowRight} />
              </Button>
            </View>
            <ScrollView keyboardShouldPersistTaps="always">
              <Overlay />
            </ScrollView>
          </View>
        </Portal>
      )}
    </Pressable>
  );
};

export default Select;
