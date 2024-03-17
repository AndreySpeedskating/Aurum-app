import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Toast, ActivityIndicator } from '@ant-design/react-native';
import { NavHeader, PageContainer } from '../../components';
import { useAuthStore } from '../../state/auth';
import { useContentStore } from '../../state/content';
import api from '../../api';
import { styles } from './styles';
import { localeDateTimeFromIso } from '../../utils/helpers';
import { Pressable, ScrollView } from 'react-native';
import { sendFiles } from '../../utils/formHelpers';
import ToastContent from '../../components/toast';
import { useUnsendingStore } from '../../state/unsending';

const HistoryDetails = ({ route, navigation }: any) => {
  const { jwt } = useAuthStore((store) => store);
  const { id } = route.params;
  const selectedApplication = useContentStore(
    (store) => store?.applications?.find((application) => application.id === id)
  );
  const { unsendingPhotos, setUnsendingPhotos } = useUnsendingStore((store) => store);
  const {
    auto_park,
    ApplicationNumber,
    SendDate,
    counterpartie,
    cargo,
    weight,
    volume,
    milleage,
    loading_point,
    alt_loading_point,
    loading_time,
    unloading_point,
    alt_unloading_point,
    unloading_time,
  } = selectedApplication || {};
  const [loading, setLoading] = useState(false);

  const navigateToHistory = (): void => {
    navigation.navigate('History');
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      const file = await sendFiles(unsendingPhotos[id])
        .then((res) => res?.join(', '))
        .catch((error) => {
          console.log(error);
          return '';
        });
      if (file === '') {
        Toast.info({
          content: (
            <ToastContent
              title="Ошибка отправки, попробуйте позже"
              onClose={() => Toast.removeAll()}
            />
          ),
          duration: 12,
          stackable: true,
        });
        return;
      }
      const payload = { ApplicationPhoto: file };
      await api.content.updateMyApplication({ id, data: payload, token: jwt }).then(() => {
        const cloneUnsendingPhotos = JSON.parse(JSON.stringify(unsendingPhotos));
        delete cloneUnsendingPhotos[id];
        setUnsendingPhotos(cloneUnsendingPhotos);
        Toast.info({
          content: <ToastContent title="Накладная обновлена" onClose={() => Toast.removeAll()} />,
          duration: 12,
          stackable: true,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer navigation={navigation}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <ActivityIndicator
          styles={{ wrapper: { width: 182, height: 182 } }}
          text="Отправка фото"
          animating={loading}
          toast
          size="large"
        />
        <NavHeader
          containerStyles={{ padding: 24 }}
          title={`TTH № ${ApplicationNumber}`}
          onNavClick={navigateToHistory}
        />
        <ScrollView style={{ flex: 1 }}>
          <Pressable style={styles.content}>
            <View style={styles.infoBlock}>
              <Text style={styles.title}>Информация о ТТН</Text>
              <View style={styles.devider} />
              <View style={styles.row}>
                <Text style={styles.text}>Номер машины</Text>
                <Text style={styles.textLight}>{auto_park?.GarageNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Дата отправки ТТН</Text>
                <Text style={styles.textLight}>{localeDateTimeFromIso(SendDate)}</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.title}>Информация о грузе</Text>
              <View style={styles.devider} />
              <Text style={styles.text}>Организация заказчика</Text>
              <Text style={styles.textLight}>{counterpartie?.name}</Text>
              <View style={styles.row}>
                <Text style={styles.text}>Тип груза</Text>
                <Text style={styles.textLight}>{cargo?.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Вес груза, тонн</Text>
                <Text style={styles.textLight}>{weight}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Объем груза, м3</Text>
                <Text style={styles.textLight}>{volume}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Пробег с грузом, км</Text>
                <Text style={styles.textLight}>{milleage}</Text>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.title}>Пункт и время погрузки</Text>
              <View style={styles.devider} />
              <Text style={styles.text}>Пункт погрузки</Text>
              <Text style={styles.textLight}>{loading_point?.name || alt_loading_point}</Text>
              <Text style={styles.text}>Время погрузки</Text>
              <Text style={styles.textLight}>{localeDateTimeFromIso(loading_time)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.title}>Пункт и время разгрузки</Text>
              <View style={styles.devider} />
              <Text style={styles.text}>Пункт разгрузки</Text>
              <Text style={styles.textLight}>{unloading_point?.name || alt_unloading_point}</Text>
              <Text style={styles.text}>Время разгрузки</Text>
              <Text style={styles.textLight}>{localeDateTimeFromIso(unloading_time)}</Text>
            </View>
            {unsendingPhotos[id] && (
              <Button onPress={onSubmit} type="primary">
                Отправить Фото
              </Button>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </PageContainer>
  );
};

export default HistoryDetails;
