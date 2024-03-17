import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: mainTheme.color_text_base_inverse,
    paddingTop: 68,
    padding: 24,
    flexDirection: 'column',
    gap: 16,
  },
  inputRow: { display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 24 },
  back: {
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    paddingLeft: 0,
    paddingRight: 0,
  },
  listItem: {
    width: '100%',
    minHeight: 42,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 0,
    borderBottomColor: mainTheme.neutral_150,
    borderBottomWidth: 1,
  },
});
