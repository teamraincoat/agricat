import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  PixelRatio,
  StyleSheet,
  Image,
} from 'react-native';
import DeleteIcon from '../assets/icons/DeleteIcon';

const ImagesContainer = (props) => {
  const { imageUri, selectedFileImages, setSelectedImages } = props;

  const removeImage = useCallback(
    (imageName) => {
      const newImages = selectedFileImages.filter(
        (item) => item.name !== imageName,
      );
      setSelectedImages(newImages);
    },
    [selectedFileImages],
  );
  return (
    <View style={localStyles.imageContainer}>
      <View style={localStyles.imageInnerContainer}>
      <Image
        source={imageUri}
        style={localStyles.imageStyle}
      />
      <TouchableOpacity
        style={localStyles.deleteIcon}
        onPress={() => removeImage(selectedFileImages[0].name)}>
        <DeleteIcon />
      </TouchableOpacity>
    </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: PixelRatio.roundToNearestPixel(5),
    paddingVertical: PixelRatio.roundToNearestPixel(5),
  },
  imageStyle: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  imageInnerContainer: {
    position: 'relative',
    margin: 5,
    marginLeft: 20,
  },
  deleteIcon: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
});

export default React.memo(ImagesContainer);
