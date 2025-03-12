import React, { useEffect, useState } from "react";
import {
  Canvas,
  Fill,
  Image,
  Shader,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { Colors } from "@/constants";

type PhotoRevealProps = {
  imageSource: any; // Источник изображения
};

const PhotoReveal: React.FC<PhotoRevealProps> = ({ imageSource }) => {
  const { width, height } = useWindowDimensions();
  const [progress, setProgress] = useState(0); // Прогресс анимации
  const image = useImage(imageSource); // Загружаем изображение

  const DOT_COLOR = [0.9686, 1.0, 0.9686]; // Цвет эффекта

  // Запуск анимации проявления

  if (!image) return null;

  return (
    <Canvas style={{ width, height }}>
      <Fill color={Colors.background} />
    </Canvas>
  );
};

export default PhotoReveal;
