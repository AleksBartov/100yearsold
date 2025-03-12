import React, { useState, useEffect } from "react";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import Greeting from "./Greeting";
import { BACKGROUND_COLOR, Colors, Stories } from "@/constants";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  cancelAnimation,
} from "react-native-reanimated";
import {
  StoryListItem,
  StoryListItemHeight,
  StoryListItemWidth,
  WindowWidth,
} from "@/components/story-list-item";
import Title from "@/components/Title";
import PhotoReveal from "@/components/PhotoReveal";

const Index: React.FC = () => {
  const [isGreetingComplete, setIsGreetingComplete] = useState(false);
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollOffset.value = contentOffset.x;
    },
  });

  const ListPadding = WindowWidth - StoryListItemWidth;

  // Очистка shared value при размонтировании компонента
  useEffect(() => {
    return () => {
      // Останавливаем анимации, связанные с scrollOffset
      cancelAnimation(scrollOffset);
    };
  }, []);

  if (isGreetingComplete) {
    return (
      <>
        <View style={styles.container}>
          <StatusBar barStyle={"dark-content"} />
          <PhotoReveal imageSource={require("./../assets/images/boris.jpg")} />
        </View>
      </>
    );
  }

  return <Greeting onComplete={() => setIsGreetingComplete(true)} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
