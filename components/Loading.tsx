import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

type Props = {};

const Loading = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Loading;
