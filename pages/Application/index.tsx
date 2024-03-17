import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Dimensions, Image, Pressable } from 'react-native';
import {
  View,
  Button,
  ActionSheet,
  Text,
  ActivityIndicator,
  Toast,
} from '@ant-design/react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NavHeader, PageContainer, Select, SimpleInput } from '../../components';
import { useAuthStore } from '../../state/auth';
import { styles } from './styles';
import { useContentStore } from '../../state/content';
import InputWrapper from './components/InputWrapper';
import DateInput from './components/DateInput';
import Block from './components/Block';
import {
  formatter,
  getCurrentStartDate,
  getFileName,
  getTime,
  returnLocaleDate,
} from './components/helpers';
import { preparedForm, sendFiles } from '../../utils/formHelpers';
import { plus } from '../../components/icons';
import FilesView from './components/FilesView';
import { getLocation } from '../../utils/geolocation';
import api from '../../api';
import { setNetworkStatus } from '../../state/service';
import { returnNetworkStatus } from '../../utils/helpers';
import ToastContent from '../../components/toast';
import { useUnsendingStore } from '../../state/unsending';

const windowWidth = Dimensions.get('screen').width;

const Application = ({ navigation }: any) => {
  const { loadingDate, unloadingDate } = getCurrentStartDate();

  const initialForm = {
    LoadingTime: loadingDate,
    UnLoadingTime: unloadingDate,
    Milleage: '',
    Volume: '',
    Weigth: '',
    conterparie: '',
    autopark: '',
    loadingPoint: '',
    unLoadingPoint: '',
    TNNumber: '',
    cargo: '',
  };

  const { jwt, _hasHydrated, id, user } = useAuthStore((store) => store);
  const { autoParks, conterparties, loadingPoints, unloadingPoints } = useContentStore(
    (store) => store
  );
  const { setUnsendingApplications, unSendingApplications, unsendingPhotos, setUnsendingPhotos } =
    useUnsendingStore((store) => store);
  const [form, setForm] = useState<{ [key: string]: string | Date | number }>(initialForm);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const dateName = useRef<'UnLoadingTime' | 'LoadingTime' | undefined>(undefined);
  const timeName = useRef<'UnLoadingTime' | 'LoadingTime' | undefined>(undefined);
  const [selectedDateName, setSelectedDateName] = useState<
    'UnLoadingTime' | 'LoadingTime' | undefined
  >(undefined);
  const [selectedTimeName, setSelectedTimeName] = useState<
    'UnLoadingTime' | 'LoadingTime' | undefined
  >(undefined);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [dateError, setDateError] = useState({ LoadingTime: false, UnLoadingTime: false });
  const [sendingMessage, setSendingMessage] = useState('');

  const selectedConterpartie = conterparties?.find((c) => c?.id === form['conterparie']);

  const { loadingPoint, unLoadingPoint, cargo } = useMemo(
    () => ({
      loadingPoint: selectedConterpartie?.loading_points,
      unLoadingPoint: selectedConterpartie?.unloading_points,
      cargo: selectedConterpartie?.cargos,
    }),
    [selectedConterpartie, form['conterparie']]
  );

  useEffect(() => {
    return () => {
      setForm(initialForm);
      Toast.removeAll();
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      setForm((prev) => ({ ...prev, userId: id }));
    }
  }, [_hasHydrated, id, jwt]);

  const navigateToMain = (): void => {
    navigation.navigate('Main');
  };

  const showActionSheet = () => {
    const BUTTONS = ['Фото', 'Медиа', 'Отмена'];
    ActionSheet.showActionSheetWithOptions(
      {
        title: 'Фото ТТН',
        message: 'Выберите место',
        options: BUTTONS,
        cancelButtonIndex: 2,
      },
      (buttonIndex: any) => {
        if (buttonIndex === 0) {
          pickImage();
          return;
        }
        if (buttonIndex === 2) {
          ActionSheet.close();
          return;
        }
        getImageFromLibrary();
      }
    );
  };

  const onSelectChange = (name: string, value: any): void => {
    if (value && emptyField?.length > 0) {
      setEmptyField((prev) => prev?.filter((f) => f !== name));
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeDateHandler = (_e: DateTimePickerEvent): void => {
    setShowDate(false);
    if (_e.type === 'set') {
      const date = new Date(_e.nativeEvent.timestamp || 0);
      if (dateName.current === 'LoadingTime') {
        setDateError({
          UnLoadingTime: date.getTime() > (form['UnLoadingTime'] as Date).getTime(),
          LoadingTime: date.getTime() > (form['UnLoadingTime'] as Date).getTime(),
        });
      }
      if (dateName.current === 'UnLoadingTime') {
        setDateError({
          UnLoadingTime: (form['LoadingTime'] as Date).getTime() > date.getTime(),
          LoadingTime: (form['LoadingTime'] as Date).getTime() > date.getTime(),
        });
      }
      setForm((prev) => ({ ...prev, [`${dateName.current}`]: date }));
    }
    setSelectedDateName(undefined);
    dateName.current = undefined;
  };

  const onChangeTimeHandler = (_e: DateTimePickerEvent): void => {
    const timedate = new Date(_e.nativeEvent.timestamp || 0);
    setShowTime(false);
    if (_e.type === 'set') {
      if (timeName.current === 'LoadingTime') {
        setDateError({
          UnLoadingTime: timedate.getTime() > (form['UnLoadingTime'] as Date).getTime(),
          LoadingTime: timedate.getTime() > (form['UnLoadingTime'] as Date).getTime(),
        });
      }
      if (timeName.current === 'UnLoadingTime') {
        setDateError({
          UnLoadingTime: (form['LoadingTime'] as Date).getTime() > timedate.getTime(),
          LoadingTime: (form['LoadingTime'] as Date).getTime() > timedate.getTime(),
        });
      }
      setForm((prev) => ({ ...prev, [`${timeName.current}`]: timedate }));
    }
    setSelectedTimeName(undefined);
    timeName.current = undefined;
  };

  const onShowDatePicker = (name: 'UnLoadingTime' | 'LoadingTime'): void => {
    dateName.current = name;
    setSelectedDateName(name);
    setTimeout(() => {
      setShowDate(true);
    }, 0);
  };

  const onShowTime = (name: 'UnLoadingTime' | 'LoadingTime'): void => {
    timeName.current = name;
    setSelectedTimeName(name);
    setTimeout(() => {
      setShowTime(true);
    }, 0);
  };

  const onChangeInput = (name: string) => (value: string) => {
    if (value && emptyField?.length > 0) {
      setEmptyField((prev) => prev?.filter((f) => f !== name));
    }
    let currentValue = value?.trim()?.length === 0 ? '' : value;
    if (['Weigth', 'Volume'].includes(name)) {
      currentValue = formatter(value);
      if (parseFloat(currentValue) > 99.99) {
        currentValue = '99.99';
      }
    }
    setForm((prev) => ({ ...prev, [name]: currentValue }));
  };

  const pickImage = async () => {
    const media = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!media.granted) {
      await ImagePicker.requestMediaLibraryPermissionsAsync().then((r) => {
        pickImage();
        return r;
      });
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      emptyField?.length > 0 &&
        setEmptyField((fields) => fields?.filter((field) => field !== 'file'));
      setImage((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        result.assets?.forEach((asset) => {
          newState.push(asset);
        });
        return newState;
      });
    }
  };

  const getImageFromLibrary = async () => {
    const media = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!media.granted) {
      await ImagePicker.requestMediaLibraryPermissionsAsync().then((r) => {
        getImageFromLibrary();
        return r;
      });
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
    });
    if (!result.canceled && result.assets) {
      emptyField?.length > 0 &&
        setEmptyField((fields) => fields?.filter((field) => field !== 'file'));
      setImage((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        result.assets?.forEach((asset) => {
          newState.push(asset);
        });
        return newState;
      });
    }
  };

  const onFileDelete = (index: number): void => {
    setImage((prev) => prev?.filter((_image, i) => i !== index));
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    const newunSendingApplications = JSON.parse(JSON.stringify(unSendingApplications));
    const networkStatus = await returnNetworkStatus();

    const emptyKeys = Object.keys(form)?.filter((key) => !`${form[key]}`);
    if (emptyKeys?.length || image?.length < 2) {
      image?.length < 2 && emptyKeys.push('file');
      Toast.info({
        content: <ToastContent title="Заполните пустые поля" onClose={() => Toast.removeAll()} />,
        duration: 12,
        stackable: true,
      });
      setEmptyField([...emptyKeys]);
      setLoading(false);
      return;
    }
    if (networkStatus) {
      console.log('start coord');
      const geoCoord = await getLocation()
        .then((response) => {
          return { latitude: response?.coords?.latitude, longitude: response?.coords?.longitude };
        })
        .catch(() => {
          return undefined;
        });
      console.log('START FILE UPLOAD');
      const files = await sendFiles(image, (value: string) =>
        setSendingMessage(`Загрузка фото ${Number(value) * 100}%`)
      );

      const postData = preparedForm({
        form,
        photos: files && files?.length > 0 ? files?.join(', ') : '',
        geoCoord,
        autoParks,
      });
      setSendingMessage('Отправка формы');
      await api.content
        .createMyApplication({ data: postData, token: jwt })
        .then((r) => {
          if (files?.length === 0) {
            const photos = JSON.parse(JSON.stringify(unsendingPhotos));
            photos[r?.data?.id] = image;
            setUnsendingPhotos(photos);
          }
          setForm(initialForm);
          Toast.info({
            content: `Накладная успешно отправлена${files?.length === 0 ? ' Без Фото' : ''}`,
            onClose: () => {
              navigation.replace('Main');
            },
          });
          return r;
        })
        .catch(async (error) => {
          console.log(error);
          await api.error.sendError({ data: { error, postData, user }, token: jwt });
          newunSendingApplications.push({
            data: preparedForm({
              form,
              photos: '',
              geoCoord: {},
              autoParks,
            }),
            files: image,
          });
          setUnsendingApplications(newunSendingApplications);
          setForm(initialForm);
          Toast.info({
            content: (
              <ToastContent
                title="Ошибка отправки, Форма будет отправлена позже"
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (!networkStatus) {
      setNetworkStatus(false);
      newunSendingApplications.push({
        data: preparedForm({
          form,
          photos: '',
          geoCoord: {},
          autoParks,
        }),
        files: image,
      });
      setUnsendingApplications(newunSendingApplications);
      setForm(initialForm);
      setLoading(false);
      Toast.info({
        content: 'Отсутствует интернет подключение, Накладная будет отправлена позже',
        onClose: () => {
          navigation.replace('Main');
        },
      });
      return;
    }
  };

  return (
    <PageContainer navigation={navigation}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <NavHeader
          containerStyles={{ padding: 24 }}
          title="Отправка ТТН"
          onNavClick={navigateToMain}
        />
        <ScrollView style={{ flex: 1 }}>
          <Pressable style={styles.form}>
            <Block title="Общая информация">
              <InputWrapper hasError={emptyField.includes('autopark')} title="Номер машины">
                <Select
                  name="autopark"
                  data={autoParks}
                  onSelectChange={onSelectChange}
                  title="Номер машины"
                  hasError={emptyField.includes('autopark')}
                />
              </InputWrapper>
              <View style={styles.row}>
                <InputWrapper
                  hasError={emptyField.includes('TNNumber')}
                  width={windowWidth - 48}
                  title="Номер ТТН">
                  <SimpleInput
                    value={form['TNNumber'] as string}
                    hasError={emptyField.includes('TNNumber')}
                    onChange={onChangeInput('TNNumber')}
                  />
                </InputWrapper>
              </View>
            </Block>
            <Block title="Информация о грузе">
              <InputWrapper
                hasError={emptyField?.includes('conterparie')}
                title="Организация заказчика">
                <Select
                  name="conterparie"
                  data={conterparties}
                  onSelectChange={onSelectChange}
                  title="Организация заказчика"
                  hasError={emptyField?.includes('conterparie')}
                />
              </InputWrapper>
              <InputWrapper hasError={emptyField?.includes('cargo')} title="Тип груза">
                <Select
                  name="cargo"
                  data={cargo}
                  disabled={!form['conterparie'] || !cargo?.length}
                  onSelectChange={onSelectChange}
                  title="Тип груза"
                  hasError={emptyField?.includes('cargo')}
                />
              </InputWrapper>
              <InputWrapper hasError={emptyField?.includes('Weigth')} title="Вес груза, тонн">
                <SimpleInput
                  maxLength={5}
                  onChange={onChangeInput('Weigth')}
                  value={form['Weigth'] as string}
                  type="decimal-pad"
                  hasError={emptyField?.includes('Weigth')}
                />
              </InputWrapper>
              <InputWrapper hasError={emptyField?.includes('Volume')} title="Объем груза, м3">
                <SimpleInput
                  maxLength={5}
                  onChange={onChangeInput('Volume')}
                  value={form['Volume'] as string}
                  type="decimal-pad"
                  hasError={emptyField?.includes('Volume')}
                />
              </InputWrapper>
              <InputWrapper hasError={emptyField?.includes('Milleage')} title="Пробег с грузом, км">
                <SimpleInput
                  onChange={onChangeInput('Milleage')}
                  value={form['Milleage'] as string}
                  type="decimal-pad"
                  hasError={emptyField?.includes('Milleage')}
                />
              </InputWrapper>
            </Block>
            <Block title="Пункт и время погрузки">
              <View style={styles.row}>
                <InputWrapper
                  hasError={emptyField?.includes('loadingPoint')}
                  width={windowWidth - 48}
                  title="Пункт погрузки">
                  <Select
                    name="loadingPoint"
                    data={loadingPoint || loadingPoints}
                    onSelectChange={onSelectChange}
                    disabled={!form['conterparie']}
                    title="Пункт погрузки"
                    hasError={emptyField?.includes('loadingPoint')}
                  />
                </InputWrapper>
              </View>
              <View style={styles.row}>
                <InputWrapper width={windowWidth - 220} title="Дата погрузки">
                  <DateInput
                    hasError={dateError.LoadingTime}
                    width="100%"
                    onPress={() => onShowDatePicker('LoadingTime')}
                    title={returnLocaleDate(form['LoadingTime'] as Date)}
                    active={selectedDateName === 'LoadingTime'}
                  />
                </InputWrapper>
                <InputWrapper title="Время погрузки">
                  <DateInput
                    hasError={dateError.LoadingTime}
                    onPress={() => onShowTime('LoadingTime')}
                    title={getTime(form['LoadingTime'] as Date)}
                    active={selectedTimeName === 'LoadingTime'}
                  />
                </InputWrapper>
              </View>
            </Block>
            <Block title="Пункт и время разгрузки">
              <View style={styles.row}>
                <InputWrapper
                  hasError={emptyField?.includes('unLoadingPoint')}
                  width={windowWidth - 48}
                  title="Пункт разгрузки">
                  <Select
                    name="unLoadingPoint"
                    data={unLoadingPoint || unloadingPoints}
                    disabled={!form['conterparie']}
                    onSelectChange={onSelectChange}
                    title="Пункт разгрузки"
                    hasError={emptyField?.includes('unLoadingPoint')}
                  />
                </InputWrapper>
              </View>
              <View style={styles.row}>
                <InputWrapper width={windowWidth - 220} title="Дата разгрузки">
                  <DateInput
                    hasError={dateError.UnLoadingTime}
                    width="100%"
                    onPress={() => onShowDatePicker('UnLoadingTime')}
                    title={returnLocaleDate(form['UnLoadingTime'] as Date)}
                    active={selectedDateName === 'UnLoadingTime'}
                  />
                </InputWrapper>
                <InputWrapper title="Время разгрузки">
                  <DateInput
                    hasError={dateError.UnLoadingTime}
                    onPress={() => onShowTime('UnLoadingTime')}
                    title={getTime(form['UnLoadingTime'] as Date)}
                    active={selectedTimeName === 'UnLoadingTime'}
                  />
                </InputWrapper>
              </View>
            </Block>
            <Block title="Фото ТТН">
              <View style={styles.row}>
                <Button
                  style={[
                    styles.fileButton,
                    emptyField?.includes('file') && styles.fileButtonError,
                  ]}
                  onPress={showActionSheet}>
                  <Image
                    source={plus}
                    style={{ width: 12, height: 12, marginTop: 4, marginLeft: -12, marginRight: 4 }}
                  />
                  <Text>Добавить фото</Text>
                </Button>
                {image?.length > 0 && (
                  <FilesView
                    onDelete={onFileDelete}
                    files={image?.map((im) => `${getFileName(im.uri)}`)}
                  />
                )}
              </View>
            </Block>
            <Button
              disabled={dateError.LoadingTime || dateError.UnLoadingTime}
              onPress={onSubmit}
              type="primary">
              Отправить ТТН
            </Button>
          </Pressable>
        </ScrollView>
        <ActivityIndicator
          styles={{ wrapper: { width: 182, height: 182 } }}
          text={sendingMessage}
          animating={loading}
          toast
          size="large"
        />
      </View>
      {showDate && (
        <DateTimePicker
          onChange={onChangeDateHandler}
          value={form[`${selectedDateName}`] as Date}
          mode="date"
          display="compact"
          maximumDate={new Date()}
        />
      )}
      {showTime && (
        <DateTimePicker
          is24Hour
          onChange={onChangeTimeHandler}
          value={form[`${selectedTimeName}`] as Date}
          mode="time"
          display="spinner"
          maximumDate={new Date()}
        />
      )}
    </PageContainer>
  );
};

export default Application;
