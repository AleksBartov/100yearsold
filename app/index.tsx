import React, { useState } from "react";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import Greeting from "./Greeting";
import { BACKGROUND_COLOR, Stories } from "@/constants";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import {
  StoryListItem,
  StoryListItemHeight,
  StoryListItemWidth,
  WindowWidth,
} from "@/components/story-list-item";
import Title from "@/components/Title";

const Index: React.FC = () => {
  const [isGreetingComplete, setIsGreetingComplete] = useState(false); // Состояние завершения приветствия
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollOffset.value = contentOffset.x;
    },
  });

  const ListPadding = WindowWidth - StoryListItemWidth;

  // Если приветствие завершено, показываем основной контент
  if (isGreetingComplete) {
    return (
      <>
        <View style={styles.container}>
          <StatusBar barStyle={"dark-content"} />
          <View
            style={{
              height: StoryListItemHeight,
              width: "100%",
            }}
          >
            <Animated.ScrollView
              onScroll={scrollHandler}
              horizontal
              snapToInterval={StoryListItemWidth}
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={Platform.OS === "android" ? 32 : 16}
              contentContainerStyle={{
                width: StoryListItemWidth * Stories.length + ListPadding,
              }}
            >
              {Stories.map((story, index) => {
                return (
                  <StoryListItem
                    index={index}
                    imageSource={story.image}
                    key={index}
                    scrollOffset={scrollOffset}
                  />
                );
              })}
            </Animated.ScrollView>
          </View>
        </View>
        <Title />
      </>
    );
  }

  // Иначе показываем приветствие
  return <Greeting onComplete={() => setIsGreetingComplete(true)} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
