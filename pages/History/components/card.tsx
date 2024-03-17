import { FC } from 'react';
import { IApplicationResponse } from '../../../api/content/interface';
import { Text, View } from '@ant-design/react-native';

import { styles } from './styles';
import React from 'react';
import { localeDateTimeFromIso } from '../../../utils/helpers';
import { Pressable } from 'react-native';

type PropTypes = {
  application: IApplicationResponse;
  status: 'await' | 'complete';
  onPress: () => void;
};

const Card: FC<PropTypes> = ({ application, status, onPress }) => (
  <Pressable onPress={onPress} style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.title}>TTH №{application?.ApplicationNumber}</Text>
      <View style={status === 'complete' ? [styles.status] : [styles.status, styles.statusAwait]}>
        <Text
          style={
            status === 'complete'
              ? [styles.statusText]
              : [styles.statusText, styles.statusTextAwait]
          }>
          {status === 'complete'
            ? `Отправлена ${!application?.ApplicationPhoto ? 'Без Фото' : ''}`
            : 'Ожидание'}
        </Text>
      </View>
    </View>
    <View style={styles.devider} />
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Дата отправки ТТН</Text>
      <Text style={styles.sectionDescription}>{localeDateTimeFromIso(application?.SendDate)}</Text>
    </View>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Организация заказчика</Text>
      <Text style={styles.sectionDescription}>{application?.counterpartie?.name}</Text>
    </View>
  </Pressable>
);

export default Card;
