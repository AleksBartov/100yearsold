import React from "react";
import {
  Canvas,
  Shader,
  Skia,
  useClock,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated"; // Импортируем из reanimated

const Index = () => {
  const clock = useClock();
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), 60); // Обновленный путь к шрифту

  // Используем useDerivedValue из react-native-reanimated для создания uniforms
  const uniforms = useDerivedValue(
    () => ({ time: clock.value / 1000 }), // Переводим время в секунды
    [clock]
  );

  // Используем !, чтобы указать, что результат не будет null
  const source = Skia.RuntimeEffect.Make(`
    uniform float time;

    // Функция для создания псевдослучайных значений
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Функция для создания плавного шума
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    vec4 main(vec2 fragCoord) {
      vec2 uv = fragCoord / vec2(300.0, 300.0); // Нормализация координат
      float noiseValue = noise(uv * 10.0 + time); // Генерация шума с учетом времени
      float threshold = smoothstep(0.3, 0.7, noiseValue); // Плавное появление
      return vec4(1.0, 1.0, 1.0, threshold); // Белый цвет с изменяющейся прозрачностью
    }
  `)!; // Используем !, чтобы указать, что source не будет null

  if (!font) return null; // Если шрифт не загружен, ничего не рендерим

  return (
    <Canvas style={{ flex: 1 }}>
      <Text
        x={50}
        y={100}
        text="Борис Бартов 100 лет"
        font={font}
        color="white"
      >
        <Shader source={source} uniforms={uniforms} />
      </Text>
    </Canvas>
  );
};

export default Index;
