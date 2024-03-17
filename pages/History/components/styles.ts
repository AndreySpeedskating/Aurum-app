import { StyleSheet } from 'react-native';
import { mainTheme } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 11,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: mainTheme.neutral_150,
  },
  devider: {
    height: 1,
    width: '100%',
    backgroundColor: mainTheme.neutral_150,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '60%',
  },
  status: {
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: mainTheme.success_200,
    backgroundColor: mainTheme.success_100,
    maxWidth: '40%',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: mainTheme.success_700,
    textAlign: 'center',
  },
  statusAwait: {
    borderColor: mainTheme.primary_200,
    backgroundColor: mainTheme.primary_100,
  },
  statusTextAwait: {
    color: mainTheme.primary_700,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    gap: 2,
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: mainTheme.neutral_600,
  },
});
