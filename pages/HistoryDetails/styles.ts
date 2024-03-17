import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: 24,
  },
  content: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  text: {
    fontSize: mainTheme.font_size_14,
    fontWeight: '400',
    color: mainTheme.neutral_800,
  },
  textLight: {
    fontSize: mainTheme.font_size_14,
    fontWeight: '400',
    color: mainTheme.neutral_600,
    justifyContent: 'flex-end',
    textAlign: 'right',
    flex: 1,
  },
  devider: {
    height: 1,
    width: '100%',
    backgroundColor: mainTheme.neutral_150,
  },
  title: {
    fontSize: 16,
    color: mainTheme.neutral_800,
  },
});
