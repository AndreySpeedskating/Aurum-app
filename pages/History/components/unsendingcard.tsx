import { FC, useState } from 'react';
import { Text, View, Modal, ActivityIndicator, Toast } from '@ant-design/react-native';
import { styles } from './styles';
import React from 'react';
import { setApplications, useContentStore } from '../../../state/content';
import { Pressable } from 'react-native';
import api from '../../../api';
import { getGeoLink } from '../../../utils/formHelpers';
import { returnDateAndTime, sendFiles } from '../../../utils/formHelpers';
import { useAuthStore } from '../../../state/auth';
import { getMyApplications } from '../../../utils/dictionaries';
import { IApplicationResponse } from '../../../api/content/interface';
import { getLocation } from '../../../utils/geolocation';
import { returnNetworkStatus } from '../../../utils/helpers';
import ToastContent from '../../../components/toast';
import { useUnsendingStore } from '../../../state/unsending';

type PropTypes = {
  application: any;
  status: 'await' | 'complete';
  files?: any[];
};

const UnsendingCard: FC<PropTypes> = ({ application, status, files }) => {
  const { conterparties } = useContentStore((store) => store);
  const { unSendingApplications, setUnsendingApplications } = useUnsendingStore((store) => store);
  const { jwt, id } = useAuthStore((store) => store);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentconterpartie = conterparties?.find(
    (c) => c.id === application?.counterpartie?.connect?.[0]?.id
  );

  const sendApplication = async () => {
    setLoading(true);
    const networkStatus = await returnNetworkStatus();
    if (networkStatus) {
      const coord = await getLocation()
        .then((response) => {
          return { latitude: response?.coords?.latitude, longitude: response?.coords?.longitude };
        })
        .catch(() => {
          alert('Ошибка получения координат');
          return undefined;
        });
      const photos = await sendFiles(files as any)
        .then((res) => res?.join(', '))
        .catch((err) => {
          console.log(err);
          Toast.info({
            content: (
              <ToastContent
                title="Ошибка отправки фото повторите попытку позже"
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
          return '';
        });
      console.log('photos', photos);

      application.ApplicationPhoto = photos === 'string' ? photos : null;
      application.geolink = getGeoLink(coord);
      application.SendDate = returnDateAndTime(new Date());
      await api.content
        .createMyApplication({ data: application, token: jwt })
        .then((r) => {
          const unsApp = unSendingApplications?.filter(
            (app) => app.data.ApplicationNumber !== application?.ApplicationNumber
          );
          setUnsendingApplications(unsApp);
          return r;
        })
        .catch(async (error) => {
          console.log(error);
          await api.error.sendError({ data: { error, application, user: id }, token: jwt });
          Toast.info({
            content: (
              <ToastContent
                title={`Ошибка Отправки ТТН № ${application?.ApplicationNumber} повторите попытку`}
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
          setLoading(false);
          return null;
        });
      await getMyApplications({
        jwt,
        userId: id,
        cbSuccess: (data) => {
          setApplications(data as IApplicationResponse[]);
        },
      }).finally(() => {
        setLoading(false);
      });
      return;
    }
    Toast.info({
      content: 'Отсутствует интернет подключение, Накладная будет отправлена позже',
    });
    setLoading(false);
  };

  const hideModal = (): void => {
    setShowModal(false);
  };

  const openModal = (): void => {
    setShowModal(true);
    Modal.alert(`Отправить ТТН № ${application?.ApplicationNumber} ?`, '', [
      { text: 'Отмена', onPress: hideModal, style: 'cancel' },
      {
        text: 'Отправить',
        onPress: () => {
          sendApplication();
        },
      },
    ]);
  };

  return (
    <>
      <Pressable onPress={openModal} style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>TTH №{`${application?.ApplicationNumber}`}</Text>
          <View
            style={status === 'complete' ? [styles.status] : [styles.status, styles.statusAwait]}>
            <Text
              style={
                status === 'complete'
                  ? [styles.statusText]
                  : [styles.statusText, styles.statusTextAwait]
              }>
              {status === 'complete' ? 'Отправлена' : 'Ожидание'}
            </Text>
          </View>
        </View>
        <View style={styles.devider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дата отправки ТТН</Text>
          <Text style={styles.sectionDescription}>Не отправлена</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Организация заказчика</Text>
          <Text style={styles.sectionDescription}>{`${currentconterpartie?.name}`}</Text>
        </View>
      </Pressable>
      <ActivityIndicator animating={loading} size="large" />
      <Modal
        visible={showModal}
        title={`Отправить ТТН № ${application?.ApplicationNumber} ?`}
        onClose={hideModal}
      />
    </>
  );
};

export default UnsendingCard;
