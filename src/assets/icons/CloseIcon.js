import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CloseIcon = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.863.197 8.46 6.6a.634.634 0 0 1-.918 0L1.137.197a.634.634 0 0 0-.918 0 .634.634 0 0 0 0 .918l6.404 6.404a.634.634 0 0 1 0 .918L.197 14.863a.634.634 0 0 0 0 .918.634.634 0 0 0 .918 0l6.404-6.404a.634.634 0 0 1 .918 0l6.426 6.426a.634.634 0 0 0 .918 0 .634.634 0 0 0 0-.918L9.4 8.46a.634.634 0 0 1 0-.918l6.404-6.404a.634.634 0 0 0 0-.918.68.68 0 0 0-.94-.022Z"
      fill="#000"
    />
  </Svg>
)
export default CloseIcon;
