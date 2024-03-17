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
  form: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
    gap: 24,
    marginTop: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    minWidth: '100%',
    width: '100%',
    gap: 16,
  },
  fileButton: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileButtonError: {
    borderColor: mainTheme.brand_error,
  },
});
