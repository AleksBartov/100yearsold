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

const Title = () => {
  const DOT_COLOR = [0.96, 0.82, 0.23];
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), 35)!;
  const sub_font = useFont(require("./../assets/fonts/Ponomar.otf"), 20)!;
  const { width, height } = useWindowDimensions();
  const clock = useClock();
  const text = "ДЕТСТВО";
  const sub_text = "В августе 1925 года в селе...";
  const textMetrics = font.measureText(text);
  const sub_textMetrics = sub_font.measureText(sub_text);

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
  
        return vec4(mix(vec3(0.0), color, alpha), 1.0);
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
          colors={["transparent", "black", "black", "black", "black"]}
        />
      </Rect>
      <Text x={(width - textMetrics.width) / 2} y={120} text={text} font={font}>
        <Shader source={effect} uniforms={uniforms} />
      </Text>
      <Text
        x={(width - sub_textMetrics.width) / 2}
        y={170}
        text={sub_text}
        font={sub_font}
      >
        <Shader source={effect} uniforms={uniforms} />
      </Text>
    </Canvas>
  );
};

export default Title;

const styles = StyleSheet.create({});
