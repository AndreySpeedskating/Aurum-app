import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  infoBlock: {
    flexDirection: 'column',
    gap: 11,
    justifyContent: 'space-between',
    borderColor: mainTheme.neutral_150,
    borderWidth: 1,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  loginText: {
    fontSize: mainTheme.font_size_14,
    fontWeight: '400',
  },
  devider: {
    height: 1,
    width: '100%',
    backgroundColor: mainTheme.neutral_150,
  },
});
