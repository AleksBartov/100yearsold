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
            decelerationRate={"fast"}
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16} // 1/60fps = 16ms
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

/*

import { BACKGROUND_COLOR, Stories } from './constants';
import {
  StoryListItem,
  StoryListItemHeight,
  StoryListItemWidth,
  WindowWidth,
} from './components/story-list-item';

const App = () => {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);

  const ListPadding = WindowWidth - StoryListItemWidth;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          height: StoryListItemHeight,
          width: '100%',
        }}
      >
        <Animated.ScrollView
          ref={animatedRef}
          horizontal
          snapToInterval={StoryListItemWidth}
          decelerationRate={'fast'}
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16} // 1/60fps = 16ms
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

*/
