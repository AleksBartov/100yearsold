import {
  Canvas,
  Rect,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";

export default function Index() {
  const { width, height } = useWindowDimensions();
  const clock = useClock(); // Хук для получения времени
  const source = Skia.RuntimeEffect.Make(`
    uniform vec2 iResolution; // Разрешение экрана
    uniform float iTime;      // Время для анимации
    float f(vec3 p) {
    p.z -= iTime * 10.;
    float a = p.z * .1;
    p.xy *= mat2(cos(a), sin(a), -sin(a), cos(a));
    return .1 - length(cos(p.xy) + sin(p.yz));
}

half4 main(vec2 fragcoord) { 
    vec3 d = .5 - fragcoord.xy1 / iResolution.y;
    vec3 p=vec3(0);
    for (int i = 0; i < 32; i++) {
      p += f(p) * d;
    }
    return ((sin(p) + vec3(2, 5, 9)) / length(p)).xyz1;
}

  `);

  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={512} height={512}>
        <Shader
          source={source}
          uniforms={{
            iResolution: [width, height], // Разрешение экрана
            iTime: clock.value, // Время для анимации
          }}
        />
      </Rect>
    </Canvas>
  );
}
