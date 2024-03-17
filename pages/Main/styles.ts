import { StyleSheet } from 'react-native';
import { mainTheme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 24,
    width: '100%',
    height: '100%',
    padding: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  topBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 32,
  },
  userName: {
    width: '80%',
    fontSize: mainTheme.font_size_22,
  },
  navButton: {
    width: 24,
    height: 24,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  addApplication: {
    backgroundColor: mainTheme.brand_primary,
  },
  historyApplication: {
    borderWidth: 1,
    borderColor: mainTheme.neutral_200,
  },
  refreshButton: {
    height: 64,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    color: mainTheme.color_text_base_inverse,
  },
  historyTitle: {
    fontSize: mainTheme.font_size_18,
    fontWeight: '700',
  },
  description: {
    color: mainTheme.neutral_300,
  },
  historyDescription: {
    color: mainTheme.neutral_500,
  },
});
