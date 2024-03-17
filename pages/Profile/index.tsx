import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, Button } from '@ant-design/react-native';
import { NavHeader, PageContainer } from '../../components';
import { resetUser, useAuthStore } from '../../state/auth';
import { styles } from './styles';
import { version } from '../../package.json';

const Profile = ({ navigation }: any) => {
  const { jwt, _hasHydrated, user, phone } = useAuthStore((store) => store);

  const navigateToMain = (): void => {
    navigation.navigate('Main');
  };

  return (
    <PageContainer navigation={navigation}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <NavHeader title="Мой профиль" onNavClick={navigateToMain} />
        <View style={styles.infoBlock}>
          <Text style={styles.userName}>{user}</Text>
          <View style={styles.devider} />
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Логин</Text>
            <Text style={styles.loginText}>{phone}</Text>
          </View>
        </View>
        <View style={[styles.loginContainer, { marginTop: 24, paddingHorizontal: 16 }]}>
          <Text style={styles.loginText}>Версия приложения</Text>
          <Text style={styles.loginText}>{version}</Text>
        </View>
        <Button
          style={{ marginTop: '20%' }}
          type="primary"
          onPress={() => {
            resetUser();
          }}>
          Сменить аккаунт
        </Button>
      </View>
    </PageContainer>
  );
};

export default Profile;
