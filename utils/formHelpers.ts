import { version } from '../package.json';
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-aws3';
import { IAutoPark } from '../api/content/interface';

const options = {
  awsUrl: 'storage.yandexcloud.net',
  bucket: 'aurum-s3',
  region: 'ru-central1',
  accessKey: 'YCAJEtVV1tffaLkBZAiqV0GvH',
  secretKey: 'YCOIZUynJbGlvVR7cgdPWf-bBRzbDBVwOLuMfXd1',
};

type PreparePropTypes = {
  form: { [key: string]: any };
  photos: string;
  autoParks: IAutoPark[];
  geoCoord: { latitude?: number; longitude?: number } | undefined;
};

const sendFileRequest = async (
  file: ImagePicker.ImagePickerAsset,
  onProgressCb?: (value: any) => void
): Promise<string | null> => {
  const initialfileName = `${file.uri?.split('/')?.pop()}`;
  const ext = initialfileName?.split('.')?.pop();
  let fileUrl: string | null = null;
  await RNS3.put({ name: initialfileName, type: `image/${ext}`, uri: file.uri }, options)
    .then((r) => {
      if (r.status === 201) {
        fileUrl = `https://storage.yandexcloud.net/aurum-s3/${initialfileName}`;
      } else {
        fileUrl = null;
      }
      return null;
    })
    .catch((e) => {
      console.log('file upload error', e);
      fileUrl = null;
      return null;
    })
    .progress((e) => {
      console.log(e.percent);
      onProgressCb?.(`${e.percent.toFixed(2)}`);
    });
  return fileUrl;
};

export const simpleValuetwoDigits = (value: number): string => {
  if (Number(value) < 10) {
    return '0' + value;
  }
  return `${value}`;
};

export const sendFiles = async (
  images: ImagePicker.ImagePickerAsset[],
  onProgressCb?: (value: any) => void
): Promise<string[]> => {
  const promises = images?.map((image) => sendFileRequest(image, onProgressCb));
  const links = await Promise.all(promises);
  return links?.filter(Boolean) as string[];
};

export const returnDateAndTime = (date: Date): string => {
  return date instanceof Date
    ? `${date.getFullYear()}-${simpleValuetwoDigits(date.getMonth() + 1)}-${simpleValuetwoDigits(
        date.getDate()
      )}T${simpleValuetwoDigits(date.getHours())}:${simpleValuetwoDigits(
        date.getMinutes()
      )}:00.000Z`
    : '2000-01-01T00:00:00.000Z';
};

export const getGeoLink = (
  payload:
    | {
        longitude?: number;
        latitude?: number;
      }
    | undefined
): string => {
  if (typeof payload === 'undefined') {
    return 'Нет координат';
  }
  const { latitude, longitude } = payload;
  return `https://yandex.ru/maps/?ll=${longitude}%2C${latitude}&mode=whatshere&whatshere%5Bpoint%5D=${longitude}%2C${latitude}&whatshere%5Bzoom%5D=16.76&z=16`;
};

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

export const preparedForm = ({ form, photos, geoCoord, autoParks }: PreparePropTypes): any => {
  const sendingData: { [key: string]: any } = {};
  sendingData.approved = false;

  if (Number.isInteger(form?.loadingPoint)) {
    sendingData.loading_point = {
      disconnect: [],
      connect: [
        {
          id: form.loadingPoint,
          position: {
            end: true,
          },
        },
      ],
    };
  } else {
    sendingData.alt_loading_point = form.loadingPoint;
  }

  if (Number.isInteger(form?.unLoadingPoint)) {
    sendingData.unloading_point = {
      disconnect: [],
      connect: [
        {
          id: form.unLoadingPoint,
          position: {
            end: true,
          },
        },
      ],
    };
  } else {
    sendingData.alt_unloading_point = form.unLoadingPoint;
  }

  sendingData.counterpartie = {
    disconnect: [],
    connect: Number.isInteger(form.conterparie)
      ? [
          {
            id: form.conterparie,
            position: {
              end: true,
            },
          },
        ]
      : [],
  };

  sendingData.cargo = {
    disconnect: [],
    connect: Number.isInteger(form?.cargo)
      ? [
          {
            id: form.cargo,
            position: {
              end: true,
            },
          },
        ]
      : [],
  };

  sendingData.auto_park = {
    disconnect: [],
    connect: Number.isInteger(form.autopark)
      ? [
          {
            id: form.autopark,
            position: {
              end: true,
            },
          },
        ]
      : [],
  };

  sendingData.users_permissions_user = {
    disconnect: [],
    connect: [
      {
        id: form.userId,
        position: {
          end: true,
        },
      },
    ],
  };

  sendingData.SendDate = returnDateAndTime(new Date());
  sendingData.ApplicationDate = returnDateAndTime(form.LoadingTime);
  sendingData.ApplicationNumber = form.TNNumber;
  sendingData.volume = parseFloat(form.Volume) > 99.99 ? 99.99 : form.Volume;
  sendingData.weight = parseFloat(form.Weigth) > 99.99 ? 99.99 : form.Weigth;
  sendingData.loading_time = returnDateAndTime(form.LoadingTime) || null;
  sendingData.unloading_time = returnDateAndTime(form.UnLoadingTime) || null;
  sendingData.ApplicationPhoto = typeof photos === 'string' ? photos : null;
  sendingData.milleage = form?.Milleage ? Number(form.Milleage) : null;
  sendingData.geolink = getGeoLink(geoCoord);
  sendingData.AppVersion = version;
  return sendingData;
};
