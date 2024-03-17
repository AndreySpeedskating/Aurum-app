import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: 16,
  },
  content: {
    flexDirection: 'column',
    width: '100%',
    padding: 24,
    gap: 16,
    marginTop: 16,
  },
  block: {
    flexDirection: 'column',
    width: '100%',
    gap: 16,
    minHeight: 136,
  },
});
