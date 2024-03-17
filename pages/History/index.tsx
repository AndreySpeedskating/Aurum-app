import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, SegmentedControl, ActivityIndicator } from '@ant-design/react-native';
import { NavHeader, PageContainer } from '../../components';
import { useAuthStore } from '../../state/auth';
import { styles } from './styles';
import { setApplications, useContentStore } from '../../state/content';
import Card from './components/card';
import UnsendingCard from './components/unsendingcard';
import { Pressable, ScrollView } from 'react-native';
import { getMyApplications } from '../../utils/dictionaries';
import { IApplicationResponse } from '../../api/content/interface';
import { useServiceStore } from '../../state/service';
import { useUnsendingStore } from '../../state/unsending';

const Profile = ({ navigation }: any) => {
  const { jwt, id, _hasHydrated } = useAuthStore((store) => store);
  const { status: networkStatus } = useServiceStore();
  const { applications } = useContentStore((store) => store);
  const { unSendingApplications } = useUnsendingStore((store) => store);
  const [filter, setFilter] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showCardSchema, setShowCardSchema] = useState<{
    unsending: boolean;
    sending: boolean;
  }>({ unsending: false, sending: false });

  const checkCardScheme = (index: number): any => {
    let unsending = false;
    let sending = false;
    if ([0, 2].includes(index)) {
      unsending = unSendingApplications?.length > 0;
    }
    if ([0, 1].includes(index)) {
      sending = applications?.length > 0;
    }
    return { unsending, sending };
  };

  useEffect(() => {
    if (_hasHydrated && jwt && networkStatus) {
      setLoading(true);
      getMyApplications({
        jwt,
        userId: id,
        cbSuccess: (data) => {
          setApplications(data as IApplicationResponse[]);
          setShowCardSchema(checkCardScheme(filter));
        },
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [_hasHydrated, networkStatus, jwt]);

  const navigateToMain = (): void => {
    navigation.navigate('Main');
  };

  const onChangeFilter = (e: any): void => {
    const index = e.nativeEvent.selectedSegmentIndex;
    setFilter(index);
    setTimeout(() => {
      setShowCardSchema(checkCardScheme(index));
    }, 0);
  };

  return (
    <PageContainer navigation={navigation}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <NavHeader
          containerStyles={{ padding: 24 }}
          title="История отправки ТТН"
          onNavClick={navigateToMain}
        />
        <SegmentedControl
          style={{ borderRadius: 4, marginLeft: 24, marginRight: 24 }}
          values={['Все', 'Отправленые', 'Ожидают отправки']}
          onChange={onChangeFilter}
          selectedIndex={filter}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.content}>
            {showCardSchema.unsending ? (
              <Pressable style={styles.block}>
                {unSendingApplications?.map((application, i) => (
                  <UnsendingCard
                    key={`unsending-${i}`}
                    application={application?.data}
                    files={application?.files}
                    status="await"
                  />
                ))}
              </Pressable>
            ) : (
              <></>
            )}
            <Pressable style={styles.block}>
              <ActivityIndicator
                styles={{ wrapper: { width: 124, height: 124 } }}
                text={` Загрузка 
      ТТН`}
                animating={loading}
                toast
                size="large"
              />
              {!loading && showCardSchema.sending && applications?.length > 0 ? (
                applications?.map((application) => (
                  <Card
                    onPress={() => {
                      navigation.push('HistoryDetails', { id: application.id });
                    }}
                    key={application?.id}
                    application={application}
                    status="complete"
                  />
                ))
              ) : (
                <></>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </PageContainer>
  );
};

export default Profile;
