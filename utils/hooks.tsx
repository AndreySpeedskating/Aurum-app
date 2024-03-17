import { Toast } from '@ant-design/react-native';
import { IApplicationResponse } from '../api/content/interface';
import { sendFiles, getGeoLink } from './formHelpers';
import { returnDateAndTime } from './formHelpers';
import { useAuthStore } from '../state/auth';
import { setApplications } from '../state/content';
import { useServiceStore } from '../state/service';
import { getMyApplications } from './dictionaries';
import { getLocation } from './geolocation';
import ToastContent from '../components/toast';
import React, { useEffect, useState } from 'react';
import api from '../api';
import { returnNetworkStatus } from './helpers';
import { useUnsendingStore } from '../state/unsending';

export const useSendDraftApplications = (): {
  prepareSendApplication: () => Promise<void>;
  sending: boolean;
} => {
  const { setNetworkStatus } = useServiceStore();
  const { jwt, id } = useAuthStore((store) => store);
  const { unSendingApplications, setUnsendingApplications } = useUnsendingStore((store) => store);
  const { status: networkStatus } = useServiceStore((store) => store);
  const [sending, setSending] = useState(false);

  const sendApplication = async (
    promises: Promise<any>[],
    sendingNumbers: string[]
  ): Promise<void> => {
    await Promise.all(promises).then(() => {
      const filteredApp = unSendingApplications?.filter(
        (unA) => !sendingNumbers?.includes(unA?.data?.ApplicationNumber)
      );
      setUnsendingApplications(filteredApp);
    });
    await getMyApplications({
      jwt,
      userId: id,
      cbSuccess: (data) => {
        setApplications(data as IApplicationResponse[]);
      },
    });
  };

  const prepareSendApplication = async (): Promise<void> => {
    const sendingNumbers: string[] = [];
    setSending(true);
    const coord = await getLocation()
      .then((response) => {
        return { latitude: response?.coords?.latitude, longitude: response?.coords?.longitude };
      })
      .catch(() => {
        return undefined;
      });
    const promises = unSendingApplications?.map(async (application) => {
      const files = await sendFiles(application.files || [])
        .then((r) => r?.join(', '))
        .catch(() => {
          Toast.info({
            content: (
              <ToastContent
                title={`Ошибка отправки фото ТТН № ${application?.data?.ApplicationNumber} повторите попытку позже`}
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
          return '';
        });

      application.data.ApplicationPhoto = typeof files === 'string' ? files : null;
      application.data.SendDate = returnDateAndTime(new Date());
      application.data.geolink = getGeoLink(coord);
      await api.content
        .createMyApplication({ data: application.data, token: jwt })
        .then((r) => {
          sendingNumbers.push(application?.data?.ApplicationNumber);
          return r;
        })
        .catch(async (error) => {
          await api.error.sendError({ token: jwt, data: { error, application, background: true } });
          Toast.info({
            content: (
              <ToastContent
                title={`Ошибка Отправки ТТН № ${application?.data?.ApplicationNumber}`}
                onClose={() => Toast.removeAll()}
              />
            ),
            duration: 12,
            stackable: true,
          });
          return null;
        })
        .finally(() => {
          setSending(false);
        });
    });
    sendApplication(promises, sendingNumbers);
  };

  useEffect(() => {
    if (!networkStatus) {
      setInterval(
        async () => {
          const status = await returnNetworkStatus();
          setNetworkStatus(!!status);
        },
        60 * 1000 * 10
      );
    }
    if (networkStatus && unSendingApplications?.length) {
      prepareSendApplication();
    }
  }, [networkStatus]);

  return { prepareSendApplication, sending };
};
