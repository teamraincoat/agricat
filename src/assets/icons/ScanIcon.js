import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ScanIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 1a1 1 0 011-1h6a1 1 0 010 2H2v5a1 1 0 01-2 0V1zm24 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-2 0V2h-5a1 1 0 01-1-1zM1 24a1 1 0 011 1v5h5a1 1 0 010 2H1a1 1 0 01-1-1v-6a1 1 0 011-1zm30 0a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 010-2h5v-5a1 1 0 011-1zM8 8h2v2H8V8z"
        fill="#545454"
      />
      <Path d="M14 4H4v10h10V4zM6 6h6v6H6V6zm4 16H8v2h2v-2z" fill="#545454" />
      <Path
        d="M14 18H4v10h10V18zm-8 2h6v6H6v-6zM22 8h2v2h-2V8z"
        fill="#545454"
      />
      <Path
        d="M18 4h10v10H18V4zm2 2v6h6V6h-6zm-4 10v4h2v2h-2v2h4v-4h2v4h2v-2h4v-2h-6v-4h-6zm4 4h-2v-2h2v2zm8 4h-2v2h-4v2h6v-4zm-8 4v-2h-4v2h4z"
        fill="#545454"
      />
      <Path d="M24 18h4v-2h-4v2z" fill="#545454" />
    </Svg>
  );
}

export default ScanIcon;
