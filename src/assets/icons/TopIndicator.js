import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const TopIndicator = (props) => (
<Svg
    width={48}
    height={48}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M15.656 29.016h2.199c.478 0 .933-.23 1.214-.619L24 21.581l4.931 6.816c.282.39.732.619 1.214.619h2.199a.376.376 0 0 0 .305-.596l-8.344-11.53a.373.373 0 0 0-.605 0l-8.344 11.53a.373.373 0 0 0 .3.596Z"
      fill="url(#a)"
    />
    <Path
      d="M24 45c11.597 0 21-9.403 21-21S35.597 3 24 3 3 12.403 3 24s9.403 21 21 21Zm0-38.437c9.628 0 17.438 7.809 17.438 17.437S33.628 41.438 24 41.438 6.563 33.628 6.563 24 14.373 6.563 24 6.563Z"
      fill="url(#b)"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={24.001}
        y1={29.016}
        x2={24.001}
        y2={16.735}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3C3434" />
        <Stop offset={1} stopColor="#0A0A0A" stopOpacity={0.46} />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={24}
        y1={45}
        x2={24}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3C3434" />
        <Stop offset={1} stopColor="#0A0A0A" stopOpacity={0.46} />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default TopIndicator
