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
import { useDerivedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

const Index = () => {
  const { width, height } = useWindowDimensions();
  const fontSize = Math.max(width, height) * 0.07;
  const padding = 30;
  const clock = useClock();
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);

  // Текст для отрисовки
  const text_1 = "к 100-летию";
  const text_2 = "протоиерея";
  const text_3 = "Бориса";
  const text_4 = "Степановича";
  const text_5 = "Бартова";

  // Передаем размеры текста и время в шейдер
  const uniforms = useDerivedValue(
    () => ({
      time: clock.value / 1000, // Время в секундах
    }),
    [clock]
  );

  // Шейдер
  const source = Skia.RuntimeEffect.Make(`
    uniform float time; // Время для анимации

vec4 main(vec2 fragCoord) {
  float threshold = fract(sin(dot(fragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
   
  float progress = mod(time, 20.0) / 10.0; 
  if (progress > 1.0) {
    progress = 2.0 - progress; 
  }

  if (progress > threshold) {
    return vec4(1.0, 1.0, 1.0, 1.0); // Белый цвет
  } else {
    return vec4(0.0, 0.0, 0.0, 1.0); // Черный цвет
  }
}
  `)!;

  if (!font) {
    return null;
  }
  // Если шейдер не создан, ничего не рендерим
  if (!source) {
    return null;
  }

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="black" />
      <Text
        x={(width - text_1.length * 30) / 2}
        y={height / 2 - fontSize * 2}
        text={text_1}
        font={font}
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
      <Text
        x={(width - text_2.length * 30) / 2}
        y={height / 2 - fontSize}
        text={text_2}
        font={font}
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
      <Text
        x={(width - text_3.length * 30) / 2}
        y={height / 2}
        text={text_3}
        font={font}
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
      <Text
        x={(width - text_4.length * 30) / 2}
        y={height / 2 + fontSize}
        text={text_4}
        font={font}
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
      <Text
        x={(width - text_5.length * 30) / 2}
        y={height / 2 + fontSize * 2}
        text={text_5}
        font={font}
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
    </Canvas>
  );
};

export default Index;
