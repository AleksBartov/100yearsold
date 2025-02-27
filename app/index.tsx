import React, { useState } from "react";
import { StatusBar, View, StyleSheet } from "react-native";
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

const Index: React.FC = () => {
  const [isGreetingComplete, setIsGreetingComplete] = useState(false);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollOffset.value = contentOffset.x;
    },
  });

  const ListPadding = WindowWidth - StoryListItemWidth;

  if (isGreetingComplete) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.scrollContainer}>
          <Animated.ScrollView
            onScroll={scrollHandler}
            horizontal
            snapToInterval={StoryListItemWidth}
            decelerationRate={"fast"}
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={{
              width: StoryListItemWidth * Stories.length + ListPadding,
            }}
          >
            {Stories.map((story, index) => (
              <StoryListItem
                key={index}
                index={index}
                imageSource={story.image}
                scrollOffset={scrollOffset}
              />
            ))}
          </Animated.ScrollView>
        </View>
      </View>
    );
  }

  return <Greeting onComplete={() => setIsGreetingComplete(true)} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    height: StoryListItemHeight,
    width: "100%",
  },
});

export default Index;
