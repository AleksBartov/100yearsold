import React from "react";
import {
  Canvas,
  Shader,
  Skia,
  useClock,
  Fill,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import Animated, { FadeIn, useDerivedValue } from "react-native-reanimated";
import { TouchableOpacity, useWindowDimensions } from "react-native";

const Index = () => {
  const { width, height } = useWindowDimensions();
  const fontSize = Math.max(width, height) * 0.046;
  const clock = useClock();
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);

  // Конфигурация анимации
  const DOT_COLOR = [0.96, 0.82, 0.23]; // Золотистый цвет в RGB

  const texts = [
    "к 100-летию",
    "протоиерея",
    "Бориса",
    "Степановича",
    "Бартова",
  ];

  // Параметры для шейдера
  const uniforms = useDerivedValue(
    () => ({
      time: clock.value / 6000,
      color: DOT_COLOR,
    }),
    [clock]
  );

  const effect = Skia.RuntimeEffect.Make(`
    uniform float time;
    uniform vec3 color;

vec4 main(vec2 fragCoord) {
  float threshold = fract(sin(dot(fragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);

  float progress = mod(time, 10.0) / 5.0; 

  if (time > threshold + 0.3) {
    return vec4(vec3(color), 1.0); 
  } else {
    return vec4(0.0, 0.0, 0.0, 1.0); // Черный цвет
  }
}
  `);
  if (!font || !effect) return null;

  return (
    <>
      <Canvas style={{ flex: 1 }}>
        <Fill color="rgba(0.0, 0.0, 0.0, 1.0)" />
        {texts.map((text, index) => {
          const textMetrics = font.measureText(text);
          return (
            <Text
              key={text}
              x={(width - textMetrics.width) / 2}
              y={height / 2 + (index - 4) * fontSize}
              text={text}
              font={font}
            >
              <Shader source={effect} uniforms={uniforms} />
            </Text>
          );
        })}
      </Canvas>
      <Animated.View
        entering={FadeIn.delay(4000).duration(3000)}
        style={{
          position: "absolute",
          bottom: 80,
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            opacity: 0.5,
            borderColor: "#f5fb2f",
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 30 * 1.613,
            paddingVertical: 13,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Text
            style={{ color: "#f5fb2f", fontSize: 20, textAlign: "center" }}
          >
            начать
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default Index;
