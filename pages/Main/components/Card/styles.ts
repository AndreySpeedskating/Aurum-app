import { StyleSheet } from 'react-native';
import { mainTheme } from '../../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    gap: 20,
  },
  title: {
    fontSize: mainTheme.font_size_18,
    fontWeight: '700',
  },
  description: {
    fontSize: mainTheme.font_size_14,
    fontWeight: '400',
    color: mainTheme.neutral_300,
  },
});
