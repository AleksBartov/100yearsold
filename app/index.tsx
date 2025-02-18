import React from "react";
import {
  Canvas,
  Shader,
  Skia,
  useClock,
  Fill,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated"; // Импортируем из reanimated

const Index = () => {
  const clock = useClock();
  // const font = useFont(require("./../assets/fonts/Ponomar.otf"), 60); // Обновленный путь к шрифту

  // Используем useDerivedValue из react-native-reanimated для создания uniforms
  const uniforms = useDerivedValue(
    () => ({ time: clock.value / 1000 }), // Переводим время в секунды
    [clock]
  );

  // Используем !, чтобы указать, что результат не будет null
  const source = Skia.RuntimeEffect.Make(`
    uniform float time;

     vec4 main(vec2 fragCoord) {
      float r = sin(time) * 0.5 + 0.5;
      float g = cos(time) * 0.5 + 0.5;
      float b = 0.5;
      return vec4(r, g, b, 1.0);
    }
  `)!; // Используем !, чтобы указать, что source не будет null

  // if (!font) return null; // Если шрифт не загружен, ничего не рендерим

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <Shader source={source} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
};

export default Index;
