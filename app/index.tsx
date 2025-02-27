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
          <Animated.FlatList
            data={Stories}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={({ item, index }) => (
              <StoryListItem
                index={index}
                imageSource={item.image}
                key={index}
                scrollOffset={scrollOffset}
              />
            )}
            onScroll={scrollHandler}
            snapToInterval={StoryListItemWidth}
            decelerationRate={"fast"}
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={Platform.OS === 'android' ? 32 : 16} // Увеличили для Android
            contentContainerStyle={{
              width: StoryListItemWidth * Stories.length + ListPadding,
            }}
          />
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