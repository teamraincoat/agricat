import React from 'react';
import { View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';

const ActionSheetBox = (props) => {
  const { ActionRef, captureFromCamera, onImageLibraryPress } = props;

  return (
    <View>
      <ActionSheet
        ref={ActionRef}
        options={['Camera', 'Camera Roll', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 2) {
            return null;
          }else if (index === 0) {
            captureFromCamera();
            console.log('Camera Roll');
          } else {
            onImageLibraryPress();
            console.log('Open Camera');
          }
        }}
      />
    </View>
  );
};

export default ActionSheetBox;
