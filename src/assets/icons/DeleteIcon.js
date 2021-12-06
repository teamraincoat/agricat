import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const DeleteIcon = props => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={11} cy={11} r={11} fill="red" />
    <Path
      d="M9.931 6.138a.38.38 0 0 0-.384.38H7.276a.38.38 0 1 0 0 .758h6.827a.379.379 0 1 0 0-.759h-2.27a.379.379 0 0 0-.385-.38H9.931ZM7.276 8.034v6.07c0 .419.34.758.758.758h5.31c.42 0 .76-.34.76-.759V8.034H7.275Z"
      fill="#fff"
    />
  </Svg>
);

export default DeleteIcon;
