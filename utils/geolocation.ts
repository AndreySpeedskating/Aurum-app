import {
  LocationObject,
  getCurrentPositionAsync,
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';

export const getLocation = async (): Promise<LocationObject | undefined> => {
  const geo = await requestForegroundPermissionsAsync();
  if (geo?.granted) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 5000);
      setTimeout(async () => {
        await getCurrentPositionAsync({ accuracy: 5 })
          .then((resoonse: LocationObject) => {
            resolve(resoonse);
            return resoonse;
          })
          .catch((err) => {
            console.log(err);
            resolve(undefined);
            return undefined;
          });
      });
    });
  } else {
    await getForegroundPermissionsAsync().then((value) => {
      if (value.granted) {
        getLocation();
      } else {
        throw new Error('GEO ACCESS DENIED');
      }
    });
  }
};
