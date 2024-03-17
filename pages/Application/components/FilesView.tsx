import { View, Text } from '@ant-design/react-native';
import React from 'react';
import { FC } from 'react';

import { styles } from './styles';
import { Image, Pressable } from 'react-native';
import { attachment, close } from '../../../components/icons';

type PropTypes = {
  files: string[];
  onDelete?: (i: number) => void;
};

const FilesView: FC<PropTypes> = ({ files, onDelete = () => console.log('work') }) => (
  <View style={styles.filesBlock}>
    {files?.map((file, i) => (
      <View key={file} style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Image source={i === 0 ? attachment : undefined} style={{ width: 12, height: 14 }} />
        <Text>{file}</Text>
        <Pressable
          onPress={() => onDelete(i)}
          style={{ marginLeft: 'auto', width: 12, height: 12 }}>
          <Image source={close} style={{ width: 8, height: 8 }} />
        </Pressable>
      </View>
    ))}
  </View>
);

export default FilesView;
