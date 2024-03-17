import { ImagePickerAsset } from 'expo-image-picker';

export const getTime = (date: Date): string => {
  return `${simpleValuetwoDigits(date.getHours())}:${simpleValuetwoDigits(date.getMinutes())}`;
};

export const getFileName = (uri: string): string | undefined => {
  const name = uri.split('/')?.at(-1);
  if (name && name?.length > 15) {
    return `${name?.slice(0, 15)}...`;
  }
  if (name) {
    return name;
  }
  return 'photo.jpg';
};

export const simpleValuetwoDigits = (value: number): string => {
  if (Number(value) < 10) {
    return '0' + value;
  }
  return `${value}`;
};

export const getCurrentStartDate = (): { loadingDate: Date; unloadingDate: Date } => {
  return { loadingDate: new Date(), unloadingDate: new Date() };
};

export const returnDate = (data: Date): string =>
  `${data.getFullYear()}-${simpleValuetwoDigits(data.getMonth() + 1)}-${simpleValuetwoDigits(
    data.getDate()
  )}`;

export const returnLocaleDate = (date: Date): string =>
  `${simpleValuetwoDigits(date.getDate())}.${simpleValuetwoDigits(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;

export const formatter = (value: string): string => {
  const clearValue = value?.replace(/[^\d.]+/g, '');
  const currentValue = clearValue?.slice(0, clearValue?.[1] === '.' ? 4 : 5)?.split('');
  return currentValue?.reduce((acc, val, i) => {
    if (i === 0 && val === '0') {
      return '';
    }
    if (i === 2 && !acc.includes('.') && val !== '.') {
      return acc + `.${val}`;
    }
    if (acc.includes('.') && val === '.') {
      return acc;
    }
    return acc + val;
  }, '');
};

export const idGenerator = (): string => Math.random().toString(20).substr(2, 8);

export const timeOut = async (delay: number): Promise<boolean> => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

type fileUploadPayload = {
  file: ImagePickerAsset;
  token: string;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
};

export function timeFormatter(str: string): string {
  let [h1 = '', h2 = '', m1 = '', m2 = ''] = str?.replace(/[^\d.]+/g, '')?.split('');
  if (h1 && Number(h1) > 2) {
    h1 = '2';
  }
  if (h2 && Number(h2) > 3 && Number(h1) === 2) {
    h2 = '3';
  }
  if (m1 && Number(m1) > 5) {
    m1 = '5';
  }
  const needHash = h1 && h2 && m1;
  return `${h1}${h2}${needHash ? ':' : ''}${m1}${m2}`;
}
