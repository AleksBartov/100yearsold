import React from "react";
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  Text,
  useClock,
  useFont,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

const source = Skia.RuntimeEffect.Make(`
  uniform float time;

    vec4 main(vec2 fragCoord) {
      float fade = clamp((fragCoord.x / 300.0) - (time * 0.001), 0.0, 1.0);
      return vec4(1.0, 1.0, 1.0, 1.0 - fade); // Белый цвет с изменяющейся прозрачностью
    }
`)!;

const Index = () => {
  const clock = useClock();
  const fontSize = 32;
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);
  const uniforms = useDerivedValue(
    () => ({ time: clock.value / 1000 }),
    [clock]
  );
  return (
    <Canvas style={{ flex: 1 }}>
      <Text x={50} y={200} text="Борис Бартов 100 лет" font={font}>
        <Shader source={source} uniforms={uniforms} />
      </Text>
    </Canvas>
  );
};

export default Index;
