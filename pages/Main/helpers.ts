import * as ImagePicker from 'expo-image-picker';
import { requestForegroundPermissionsAsync, getForegroundPermissionsAsync } from 'expo-location';

export const getPermissions = async (
  status: ImagePicker.PermissionResponse | null
): Promise<void> => {
  const camera = await ImagePicker.getCameraPermissionsAsync();
  const media = await ImagePicker.getMediaLibraryPermissionsAsync();
  const geo = await requestForegroundPermissionsAsync();
  if (!camera.granted) {
    await ImagePicker.requestCameraPermissionsAsync();
  }
  if (!media.granted) {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  }
  if (!status?.granted) {
    await requestForegroundPermissionsAsync();
  }
  if (!geo.granted) {
    await getForegroundPermissionsAsync();
  }
};
