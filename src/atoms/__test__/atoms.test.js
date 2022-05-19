/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';

import EButton from '../EButton';
import BackgroundImage from '../BackgroundImage';
import CameraView from '../CameraView';
import EText from '../EText';
import ETextInput from '../ETextInput';
import ImagesContainer from '../ImagesContainer';

jest.useFakeTimers();
let mockedExp: jest.Mock;
jest.mock('react-native-iphone-x-helper', () => ({
  isIphoneX: () => 'You have called a mocked method 1!',
}));
jest.mock('../../assets/capture.png', () => 'CaptureImg');
jest.mock('react-native-camera-kit', () => ({
  CameraScreen: () => 'CameraScreen',
  CameraType: () => 'CameraType',
}));
jest.mock('react-native-blob-util', () => ({
  fs: {
    stat: () => 'fs.stat',
    readFile: () => 'fs.readFile',
  },
}));
jest.mock('react-native-image-resizer', () => ({
  createResizedImage: () => 'createResizedImage',
}));

jest.mock('../../localization/en.json', () => 'en');
jest.mock('../../localization/es.json', () => 'es');
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    defaultValues: {
      maizeCultivation: [],
    },
    control: ({
      register, unregister, getValues, setValue, reset,
    }) => ({
      register,
      unregister,
      getValues,
      setValue,
      reset,
    }),
    formState: {
      errors: {},
    },
  }),
  Controller: () => 'Controller',
}));
jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: {
    getItem: () => 'getItem',
    setItem: () => 'setItem',
    removeItem: () => 'removeItem',
  },
}));

jest.mock('react-native-localization', () => jest.fn().mockImplementation(() => ({
  init: mockedExp,
})));

test('render Button component', () => {
  const tree = renderer.create(<EButton />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render BackgroundImage component', () => {
  const tree = renderer.create(<BackgroundImage />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render Camera component', () => {
  const { toJSON } = renderer.create(
    <CameraView
      setIsCameraVisible={() => {}}
      selectedFiles={[]}
      setSelectedFiles={() => {}}
    />,
  );
  expect(toJSON()).toMatchSnapshot();
});
test('render EText component', () => {
  const tree = renderer.create(<EText />).toJSON();
  expect(tree).toMatchSnapshot();
});
test('render ETextInput component', () => {
  const tree = renderer.create(<ETextInput />).toJSON();
  expect(tree).toMatchSnapshot();
});
test('render ImagesContainer component', () => {
  const tree = renderer
    .create(
      <ImagesContainer
        imageUri={{
          uri: undefined,
        }}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
