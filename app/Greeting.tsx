import React, { useState, useEffect } from "react";
import {
  Canvas,
  Shader,
  Skia,
  useClock,
  Fill,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import Animated, {
  FadeIn,
  FadeOut,
  useDerivedValue,
} from "react-native-reanimated";
import { StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import { Colors } from "@/constants";

type GreetingProps = {
  onComplete: () => void; // Колбэк, который вызывается после завершения анимации
};

const Greeting: React.FC<GreetingProps> = ({ onComplete }) => {
  const { width, height } = useWindowDimensions();
  const fontSize = Math.max(width, height) * 0.046;
  const clock = useClock();
  const font = useFont(require("./../assets/fonts/Ponomar.otf"), fontSize);

  const DOT_COLOR = [0.9686, 1.0, 0.9686];
  const [isStarted, setIsStarted] = useState(false); // Состояние для начала анимации скрытия
  const [isVisible, setIsVisible] = useState(true); // Состояние для видимости компонента
  const [progress, setProgress] = useState(0); // Прогресс анимации

  const texts = [
    "к 100-летию",
    "протоиерея",
    "Бориса",
    "Степановича",
    "Бартова",
  ];

  // Управление прогрессом анимации
  useEffect(() => {
    if (!isVisible) return;

    let animationFrame: number | null = null; // Явно указываем тип number | null
    const startTime = Date.now();
    const duration = 6000; // Длительность анимации в миллисекундах

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = isStarted
        ? 1 - Math.min(elapsed / duration, 1) // Обратная анимация
        : Math.min(elapsed / duration, 1); // Прямая анимация

      setProgress(newProgress);

      if (elapsed < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else if (isStarted) {
        setIsVisible(false); // Скрыть компонент после завершения обратной анимации
        onComplete(); // Вызываем колбэк после завершения анимации
      }
    };

    animate();

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isStarted, isVisible, onComplete]);

  const uniforms = useDerivedValue(
    () => ({
      time: progress, // Используем progress для управления анимацией
      color: DOT_COLOR,
      resolution: [width, height],
    }),
    [progress]
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
  `);

  if (!font || !effect) return null;

  const handleStart = () => {
    setIsStarted(true); // Запуск обратного эффекта
  };

  if (!isVisible) return null; // Скрытие компонента, если isVisible = false

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Canvas style={{ flex: 1 }}>
        <Fill color="rgba(48.0, 48.0, 48.0, 1.0)" />
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
      {!isStarted && (
        <Animated.View
          entering={FadeIn.delay(3000).duration(3000)}
          exiting={FadeOut.duration(1000)}
          style={{
            position: "absolute",
            bottom: 80,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleStart}
            style={{
              opacity: 0.5,
              borderColor: Colors.white,
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 30 * 1.613,
              paddingVertical: 13,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.Text
              style={{ color: Colors.white, fontSize: 20, textAlign: "center" }}
            >
              начать
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

export default Greeting;
