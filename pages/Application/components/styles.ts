import { StyleSheet } from 'react-native';
import { mainTheme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: mainTheme.neutral_400,
  },
  titleError: {
    color: mainTheme.brand_error,
  },
  input: {
    minWidth: 156,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 42,
    paddingLeft: 14,
    fontSize: 14,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
  },
  inputText: {
    fontSize: 14,
    color: mainTheme.neutral_500,
    fontWeight: '400',
  },
  block: {
    flexDirection: 'column',
    gap: 12,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  filesBlock: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
  },
});
