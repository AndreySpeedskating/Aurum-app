import * as Network from 'expo-network';
import * as Updates from 'expo-updates';
import * as BackgroundFetch from 'expo-background-fetch';
import NetInfo from '@react-native-community/netinfo';
import { Restart } from 'fiction-expo-restart';

export const localeDateTimeFromIso = (isoDate?: string | null): string => {
  if (!isoDate) {
    return '';
  }

  const [date, time] = isoDate?.split('T');

  return `${date?.split('-')?.reverse()?.join('.')}, ${time?.slice(0, 5)}`;
};

export const returnNetworkStatus = async (): Promise<boolean> => {
  const netInfo = await Network.getNetworkStateAsync();
  const networkType = (await NetInfo.fetch().then((state) => state)) as any;
  const isCellular = networkType?.type === 'cellular';
  if (isCellular) {
    return (
      !!netInfo.isConnected &&
      ['3g', '4g', '5g']?.includes(networkType?.details['cellularGeneration'])
    );
  }

  return !!netInfo.isConnected && networkType?.type === 'wifi';
};

export async function onFetchUpdateAsync() {
  await Updates.checkForUpdateAsync()
    .then(async (update) => {
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync().then(async () => {
          console.log('RELOAD');
          Restart();
        });
        return update;
      }
      return null;
    })
    .catch((error) => {
      alert(`Ошибка обновления приложения: ${error}`);
      return null;
    });
}

export const TASK_NAME = 'BACKGROUND_TASK';

export const registerBackgroundTask = async (taskName: string) => {
  try {
    console.log('Task registered');
    return await BackgroundFetch.registerTaskAsync(taskName, {
      minimumInterval: 60 * 5, // seconds,
    });
  } catch (err) {
    console.log('Task Register failed:', err);
    return null;
  }
};
