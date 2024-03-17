import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  scroll: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
  button: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 32,
  },
  exitButton: {
    marginLeft: 'auto',
    width: 128,
    borderColor: 'transparent',
  },
  text: {
    fontSize: 12,
  },
  logo: {
    position: 'relative',
    top: '10%',
    width: 154,
    height: 72,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
  },
  errorMessage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: mainTheme.brand_error,
  },
});
