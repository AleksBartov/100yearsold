import React, { useState } from "react";
import {
  Canvas,
  Image,
  Blur,
  useImage,
  BlurMask,
} from "@shopify/react-native-skia";
import { StatusBar, useWindowDimensions } from "react-native";
import Greeting from "./Greeting";

const Index: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [isGreetingComplete, setIsGreetingComplete] = useState(false); // Состояние завершения приветствия
  const image = useImage(require("./../assets/images/boris.jpg")); // Загружаем изображение

  // Если приветствие завершено, показываем основной контент
  if (isGreetingComplete) {
    return (
      <>
        <StatusBar barStyle={"dark-content"} />
        <Canvas style={{ flex: 1 }}>
          {image && (
            <Image
              image={image}
              x={0}
              y={0}
              width={width}
              height={height}
              fit="cover"
            >
              <BlurMask blur={76} style="normal" />
            </Image>
          )}
        </Canvas>
      </>
    );
  }

  // Иначе показываем приветствие
  return <Greeting onComplete={() => setIsGreetingComplete(true)} />;
};

export default Index;
