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
  const clock = useClock();
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);

  // Конфигурация анимации
  const CYCLE_DURATION = 8; // Полный цикл анимации в секундах
  const DOT_COLOR = [0.96, 0.82, 0.23]; // Золотистый цвет в RGB

  const texts = [
    "к 100-летию",
    "протоиерея",
    "Бориса",
    "Степановича",
    "Бартова",
  ];

  // Параметры для шейдера
  const uniforms = useDerivedValue(() => ({
    time: clock.value / 1000,
    color: DOT_COLOR,
    cycle: CYCLE_DURATION,
  }), [clock]);

  // Улучшенный шейдер
  const shaderSource = `
    uniform float time;
    uniform vec3 color;
    uniform float cycle;

    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    vec4 main(vec2 fragCoord) {
      // Генерация шума с масштабированием
      float noise = hash(fragCoord.xy * 0.8);
      
      // Плавный прогресс с easing
      float t = fract(time / cycle);
      float progress = smoothstep(0.0, 1.0, t) * smoothstep(1.0, 0.0, t);
      
      // Адаптивный порог с гистерезисом
      float threshold = mix(0.25, 0.75, progress);
      
      // Плавное переключение цветов
      return vec4(mix(vec3(0.0), color, smoothstep(threshold-0.1, threshold+0.1, noise)), 1.0);
    }
  `;

  const effect = Skia.RuntimeEffect.Make(shaderSource);
  if (!font || !effect) return null;

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="#1a1a1a" /> {/* Темно-серый фон */}
      
      {texts.map((text, index) => {
        const textMetrics = font.measureText(text);
        return (
          <Text
            key={text}
            x={(width - textMetrics.width) / 2}
            y={height / 2 + (index - 2) * fontSize * 1.2}
            text={text}
            font={font}
          >
            <Shader source={effect} uniforms={uniforms} />
          </Text>
        );
      })}
    </Canvas>
  );
};

export default Index;