import { StyleSheet, useWindowDimensions, View } from "react-native";
import React from "react";
import {
  Canvas,
  useFont,
  Text,
  Fill,
  LinearGradient,
  vec,
  Rect,
} from "@shopify/react-native-skia";

const Title = () => {
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), 35);
  const { width, height } = useWindowDimensions();
  return (
    <Canvas
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
        height: height * 0.38,
      }}
    >
      <Rect x={0} y={0} width={width} height={256}>
        <LinearGradient
          start={vec(width / 2, 0)}
          end={vec(width / 2, height * 0.38)}
          colors={["transparent", "black", "black", "black", "black"]}
        />
      </Rect>
    </Canvas>
  );
};

export default Title;

const styles = StyleSheet.create({});
