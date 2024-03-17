import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: mainTheme.font_size_22,
    fontWeight: '700',
    color: mainTheme.brand_primary,
    lineHeight: 26,
    maxWidth: '80%',
  },
  navButton: {
    width: 16,
    height: 16,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
