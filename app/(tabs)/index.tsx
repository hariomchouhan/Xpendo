import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";

type Props = {};

const Home = (props: Props) => {
  const {user} = useAuth()

  console.log("user: ", user);
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({});

export default Home;
