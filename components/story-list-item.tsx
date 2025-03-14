import React from "react";
import { Image, type ImageSource } from "expo-image";
import { Dimensions, StyleSheet, Platform } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Extrapolation,
  interpolate,
  SlideInRight,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Stories } from "@/constants";

export const WindowWidth = Dimensions.get("window").width;
export const StoryListItemWidth = WindowWidth * 0.75;
export const StoryListItemHeight = (StoryListItemWidth / 3) * 4;

type StoryListItemProps = {
  imageSource: ImageSource;
  index: number;
  scrollOffset: SharedValue<number>;
};

export const StoryListItem: React.FC<StoryListItemProps> = React.memo(
  ({ imageSource, index, scrollOffset }) => {
    const activeIndex = useDerivedValue(
      () => scrollOffset.value / StoryListItemWidth
    );

    const rContainerStyle = useAnimatedStyle(() => {
      const paddingLeft = (WindowWidth - StoryListItemWidth) / 2;

      const translateX = interpolate(
        activeIndex.value,
        [index - 2, index - 1, index, index + 1, index + 2],
        [
          StoryListItemWidth * 2,
          StoryListItemWidth,
          0,
          -StoryListItemWidth,
          -StoryListItemWidth * 2,
        ],
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [30, 0, 30],
        Extrapolation.CLAMP
      );

      const scale = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.8, 1, 0.8],
        Extrapolation.CLAMP
      );

      const opacity = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.3, 0.8, 0.3],
        Extrapolation.CLAMP
      );

      return {
        left: paddingLeft,
        transform: [
          { translateX: scrollOffset.value + translateX },
          { translateY },
          { scale },
        ],
        opacity,
      };
    }, []);

    return (
      <Animated.View
        entering={SlideInRight.duration(2000)}
        style={[
          styles.container,
          rContainerStyle,
          Platform.OS === "android"
            ? { elevation: Stories.length - index }
            : { zIndex: Stories.length - index },
        ]}
      >
        <Image source={imageSource} style={styles.image} />
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: StoryListItemWidth,
    height: StoryListItemHeight,
    borderRadius: 25,
  },
  image: {
    width: StoryListItemWidth,
    height: StoryListItemHeight,
    borderRadius: 25,
  },
});

export default StoryListItem;
