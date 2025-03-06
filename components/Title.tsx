import { StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import {
  Canvas,
  useFont,
  Text,
  LinearGradient,
  vec,
  Rect,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { Colors } from "@/constants";

const Title = () => {
  const DOT_COLOR = [0.9686, 1.0, 0.9686];
  const fontSize = 30;
  const sub_fontSize = 20;
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);
  const sub_font = useFont(
    require("./../assets/fonts/Ponomar.otf"),
    sub_fontSize
  );
  const { width, height } = useWindowDimensions();
  const clock = useClock();
  const texts = [
    "ДЕТСТВО",
    "В августе 1925 года в",
    "селе Кинделино",
    "Пермской области",
    "родился мальчик...",
  ];

  const uniforms = useDerivedValue(
    () => ({
      time: clock.value / 9000,
      color: DOT_COLOR,
      resolution: [width, 256],
    }),
    [clock.value]
  );

  const effect = Skia.RuntimeEffect.Make(`
      uniform float time;
uniform vec3 color;
uniform vec2 resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / resolution;

  // Определяем направление заливки (случайное)
  float direction = hash(vec2(0.5, 0.5)) > 0.5 ? 1.0 : -1.0;

  // Прогресс заливки
  float progress = clamp(time, 0.0, 1.0);

  // Ветвистый эффект с использованием шума
  float noise = smoothNoise(uv * 10.0 + time * 2.0) * 0.2;
  float fill = direction > 0.0 ? uv.x : 1.0 - uv.x;
  fill += noise;

  // Плавный переход
  float alpha = smoothstep(0.0, 0.1, fill - (1.0 - progress));

  // Начальный цвет текста - полностью прозрачный
  vec3 initialColor = vec3(0.0); // Черный цвет (или любой другой, но с alpha = 0)
  return vec4(mix(initialColor, color, alpha), alpha); // Добавляем alpha для прозрачности
}
    `)!;

  if (!font || !sub_font || !effect) return null;
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
          colors={[
            "rgba(48.0, 48.0, 48.0, 0.0)",
            "rgba(48.0, 48.0, 48.0, 0.9)",
            "rgba(48.0, 48.0, 48.0, 1.0)",
            "rgba(48.0, 48.0, 48.0, 1.0)",
            "rgba(48.0, 48.0, 48.0, 1.0)",
            "rgba(48.0, 48.0, 48.0, 1.0)",
          ]}
        />
      </Rect>
      {texts.map((text, index) => {
        const textMetrics =
          index === 0 ? font.measureText(text) : sub_font.measureText(text);
        return (
          <Text
            key={text}
            x={(width - textMetrics.width) / 2}
            y={(index === 0 ? 100 : 130) + index * sub_fontSize}
            text={text}
            font={index === 0 ? font : sub_font}
          >
            <Shader source={effect} uniforms={uniforms} />
          </Text>
        );
      })}
    </Canvas>
  );
};

export default Title;

const styles = StyleSheet.create({});
