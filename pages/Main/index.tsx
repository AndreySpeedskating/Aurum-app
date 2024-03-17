import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { Restart } from 'fiction-expo-restart';
import { View, Text, Button, ActivityIndicator, Toast } from '@ant-design/react-native';
import { PageContainer } from '../../components';
import { useAuthStore } from '../../state/auth';
import { profile, clockwise, cross } from '../../components/icons';
import {
  setAutoParks,
  setConterparties,
  setLoadingPoints,
  setUnLoadingPoints,
} from '../../state/content';
import { styles } from './styles';
import { returnNetworkStatus } from '../../utils/helpers';
import {
  getAutoPark,
  getConterparies,
  getLoadingPoint,
  getUnLoadingPoint,
} from '../../utils/dictionaries';
import { useBackgroundPermissions } from 'expo-location';
import { IAutoPark, IConterpartieResponse } from '../../api/content/interface';
import { setNetworkStatus, useServiceStore } from '../../state/service';
import ToastContent from '../../components/toast';
import { Card } from './components';
import { getPermissions } from './helpers';

const Main = ({ navigation }: any) => {
  const { jwt, user, _hasHydrated } = useAuthStore((store) => store);
  const { status: networkStatus } = useServiceStore();
  const [loading, setLoading] = useState(false);

  const [status] = useBackgroundPermissions();

  const refreshDictionaries = async (): Promise<void> => {
    const status = await returnNetworkStatus();
    if (status !== networkStatus) {
      setNetworkStatus(status);
    }
    if (status) {
      setLoading(true);
      await Promise.allSettled([
        getAutoPark({
          jwt,
          cbSuccess(data) {
            setAutoParks(data as IAutoPark[]);
          },
        }),
        await getConterparies({
          jwt,
          cbSuccess(data) {
            setConterparties(data as IConterpartieResponse[]);
          },
        }),
        await getLoadingPoint({
          jwt,
          cbSuccess(data) {
            setLoadingPoints(data);
          },
        }),
        await getUnLoadingPoint({
          jwt,
          cbSuccess(data) {
            setUnLoadingPoints(data);
          },
        }),
      ])
        .then(() => {
          Toast.info({
            content: <ToastContent title="Данные загружены" onClose={() => Toast.removeAll()} />,
            duration: 12,
            stackable: true,
          });
          return true;
        })
        .catch(() => {
          Toast.info({
            content: (
              <ToastContent
                title="Ошибка обновления данных, повторите позже"
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
          return null;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Toast.info({
        content: (
          <ToastContent
            title="Отсутствует интернет соединение, повторите позже"
            onClose={() => Toast.removeAll()}
          />
        ),
        duration: 12,
        stackable: true,
      });
    }
  };

  useEffect(() => {
    getPermissions(status);
  }, [status]);

  useEffect(() => {
    if (jwt && networkStatus) {
      refreshDictionaries();
    }
  }, [_hasHydrated, networkStatus, jwt, status]);

  const navigateToProfile = (): void => {
    navigation.navigate('Profile');
  };

  const navigateToApplication = (): void => {
    navigation.navigate('Application');
  };

  const navigateToHistory = (): void => {
    navigation.navigate('History');
  };

  const refresh = (): void => {
    Restart();
  };

  return (
    <PageContainer navigation={navigation}>
      <StatusBar style="auto" />
      <ActivityIndicator
        text={`Загрузка справочников`}
        animating={loading}
        styles={{ wrapper: { width: 182, height: 182 } }}
        toast
        size="large"
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.topBlock}>
            <Text style={styles.userName}>{`Добрый день, ${user} !`}</Text>
            <Button onPress={navigateToProfile} style={styles.navButton}>
              <Image style={{ width: 24, height: 24 }} source={profile} />
            </Button>
          </View>
          <Card
            onPress={navigateToApplication}
            title="Отправить форму ТТН"
            description="Заполнение данных новой ТТН"
            containerStyle={styles.addApplication}
            icon={cross}
            titleStyle={styles.title}
            descriptionStyle={styles.description}
          />
          <Card
            onPress={navigateToHistory}
            title="История отправки ТТН"
            description="Просмотр ТТН отправленых и ожидющих отправки"
            containerStyle={styles.historyApplication}
            icon={clockwise}
            descriptionStyle={styles.historyDescription}
          />
          <Button style={[styles.refreshButton]} onPress={refreshDictionaries}>
            <Text style={styles.historyTitle}>Обновить справочники</Text>
          </Button>
          <Button style={[styles.refreshButton]} onPress={refresh}>
            <Text style={styles.historyTitle}>Перезагрузить приложение</Text>
          </Button>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default Main;
