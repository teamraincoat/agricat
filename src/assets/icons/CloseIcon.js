import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CloseIcon(props) {
  return (
    <Svg
      width={30}
      height={30}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M29 29L1 1m0 28L29 1 1 29z"
        stroke="#545454"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CloseIcon;
