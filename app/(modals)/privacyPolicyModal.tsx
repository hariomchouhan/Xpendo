import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";

type Props = {};

const PrivacyPolicyModal = (props: Props) => {
  const email = process.env.EXPO_PUBLIC_EMAIL;

  const handleEmailPress = async () => {
    const url = `mailto:${email}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Email app is not available.");
    }
  };
  return (
    <ModalWrapper>
      <ScrollView style={styles.container}>
        <Header
          title={"Privacy Policy"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <Typo style={styles.sectionTitle}>Introduction</Typo>
        <Typo style={styles.text}>
          This Privacy Policy explains how we collect, use, and protect your
          information when you use our application.
        </Typo>

        <Typo style={styles.sectionTitle}>Information We Collect</Typo>
        <Typo style={styles.text}>
          We may collect personal information such as your name, email address,
          and usage data to improve our services.
        </Typo>

        <Typo style={styles.sectionTitle}>How We Use Your Information</Typo>
        <Typo style={styles.text}>
          Your information helps us to understand user behavior and enhance your
          experience with our application.
        </Typo>

        <Typo style={styles.sectionTitle}>Data Protection</Typo>
        <Typo style={styles.text}>
          We take appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction.
        </Typo>

        <Typo style={styles.sectionTitle}>Changes to This Privacy Policy</Typo>
        <Typo style={styles.text}>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </Typo>

        <Typo style={styles.sectionTitle}>Contact Us</Typo>
        <Typo style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us
          at
        </Typo>
        <TouchableOpacity onPress={handleEmailPress}>
          <Typo
            style={{
              fontSize: 18,
              color: colors.primary,
              textDecorationLine: "underline",
            }}
          >
            {email}
          </Typo>
        </TouchableOpacity>
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
});

export default PrivacyPolicyModal;
