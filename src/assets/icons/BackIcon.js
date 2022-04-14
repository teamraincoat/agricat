import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const BackIcon = (props) => (
  <Svg
    width={25}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G
      clipPath="url(#a)"
      stroke="#000"
      strokeWidth={1.5}
      strokeMiterlimit={10.94}
      strokeLinecap="round"
    >
      <Path d="M6.115 11.44.776 5.996 6.115.56M1.245 5.996H24.45" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h25v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

export default BackIcon
