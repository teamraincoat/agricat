import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

const BottomIndicator = (props) => (
    <Svg
    width={48}
    height={48}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M32.344 18.985h-2.199a1.5 1.5 0 0 0-1.213.618L24 26.42l-4.931-6.816a1.495 1.495 0 0 0-1.214-.618h-2.199c-.304 0-.482.346-.304.595l8.343 11.531c.15.206.455.206.605 0l8.344-11.531a.373.373 0 0 0-.3-.595Z"
      fill="url(#a)"
    />
    <Path
      d="M24 3C12.403 3 3 12.403 3 24s9.403 21 21 21 21-9.403 21-21S35.597 3 24 3Zm0 38.438c-9.628 0-17.437-7.81-17.437-17.438S14.373 6.563 24 6.563c9.628 0 17.438 7.81 17.438 17.437 0 9.628-7.81 17.438-17.438 17.438Z"
      fill="url(#b)"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={23.999}
        y1={18.985}
        x2={23.999}
        y2={31.266}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3C3434" />
        <Stop offset={1} stopColor="#0A0A0A" stopOpacity={0.46} />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={24}
        y1={3}
        x2={24}
        y2={45}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#3C3434" />
        <Stop offset={1} stopColor="#0A0A0A" stopOpacity={0.46} />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default BottomIndicator
