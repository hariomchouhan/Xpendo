import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors, radius } from "@/constants/theme";
import { useRouter } from "expo-router";

type Props = {};

const index = (props: Props) => {
    // const router = useRouter();
    // useEffect(() => {
    //     setTimeout(() => {
    //         router.push('/(auth)/welcome')
    //     }, 2000 );
    // }, [])
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("@/assets/images/splashImage.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: '20%',
    aspectRatio: 1,
    borderRadius: radius._20,
  }
});

export default index;
