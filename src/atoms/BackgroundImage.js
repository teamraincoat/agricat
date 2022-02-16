import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { wp, hp } from '../styles/metrics';

export default function BackgroundImage({
  src,
  backgroundStyle,
  imageStyle,
  children,
}) {
  return (
    <ImageBackground
      style={[styles.imgBackground, backgroundStyle]}
      resizeMode="cover"
      imageStyle={imageStyle}
      source={src}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    width: wp(100),
    height: hp(100),
  },
});
