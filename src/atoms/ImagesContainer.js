import React, {useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  PixelRatio,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import DeleteIcon from '../assets/icons/DeleteIcon';

const ImagesContainer = props => {
  const {selectedFileImages, setSelectedImages} = props;

  const removeImage = useCallback(
    imageName => {
      let newImages = selectedFileImages.filter(
        item => item.name !== imageName,
      );
      setSelectedImages(newImages);
    },
    [selectedFileImages],
  );

  const ImagesViewContainer = React.memo(({item}) => {
    return (
      <View style={localStyles.imageInnerContainer}>
          <Image source={{ uri: `data:image/png;base64,${item.uri}`}} style={localStyles.imageStyle}  />
        <TouchableOpacity
          style={localStyles.deleteIcon}
          onPress={() => removeImage(item.name)}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    );
  });

  const renderImageView = ({item}) => <ImagesViewContainer item={item} />;
  return (
    <View style={localStyles.imageContainer}>
      <FlatList
        data={selectedFileImages}
        keyExtractor={(item, index) => item.name}
        extraData={selectedFileImages}
        renderItem={renderImageView}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
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
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  imageInnerContainer: {
    position: 'relative',
    margin: 5,
  },
  deleteIcon: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
});

export default React.memo(ImagesContainer);
