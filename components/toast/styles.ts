import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '90%',
    padding: 16,
  },
  title: {
    fontSize: mainTheme.font_size_18,
    fontWeight: '700',
    color: mainTheme.neutral_200,
    lineHeight: 22,
  },
  navButton: {
    padding: 0,
    borderWidth: 2,
    borderColor: mainTheme.neutral_200,
    backgroundColor: 'transparent',
  },
});
