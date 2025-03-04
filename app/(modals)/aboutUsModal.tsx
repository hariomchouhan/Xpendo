import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { Envelope, PhoneCall } from "phosphor-react-native";

type Props = {};

const AboutUsModal = (props: Props) => {
  const phoneNumber = process.env.EXPO_PUBLIC_PHONE_NUMBER;
  const email = process.env.EXPO_PUBLIC_EMAIL;

  const handleCallPress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

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
          title={"About App & Us"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* About App */}
        <View
          style={{
            marginTop: verticalScale(15),
            marginBottom: verticalScale(25),
          }}
        >
          <Typo style={{ fontStyle: "italic" }}>
            {"`"}
            <Typo fontWeight={"600"} color={colors.primary}>
              Xpendo
            </Typo>{" "}
            is a sleek, user-friendly expense tracker app designed to simplify
            your financial management. With real-time transaction tracking,
            intuitive budgeting tools, and detailed analytics,{" "}
            <Typo fontWeight={"600"} color={colors.primary}>
              Xpendo{" "}
            </Typo>
            empowers you to take full control of your money. Enjoy highly
            customizable wallets, divide into categories, secure data storage,
            and effortless organization for smarter spending and improved
            savings.{"`"}
          </Typo>
        </View>

        {/* About Us */}
        <View style={styles.aboutUsContainer}>
          <Typo>For any Issues/Improvement:</Typo>

          {/* For Call */}
          <View style={{ flexDirection: "row" }}>
            <PhoneCall color={colors.white} size={23} />
            <Typo style={{ fontSize: 18, marginBottom: 10 }}>
              {" "}
              Contact {" - "}
            </Typo>

            <TouchableOpacity onPress={handleCallPress}>
              <Typo
                style={{
                  fontSize: 18,
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                {phoneNumber}
              </Typo>
            </TouchableOpacity>
          </View>

          {/* For Email */}
          <View style={{ flexDirection: "row" }}>
            <Envelope color={colors.white} size={23} />
            <Typo style={{ fontSize: 18, marginBottom: 10 }}>
              {" "}
              Email {" - "}
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
          </View>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  aboutUsContainer: {
    paddingVertical: verticalScale(25),
    gap: scale(12),
    borderTopWidth: 1,
    borderTopColor: colors.white,
  },
});

export default AboutUsModal;
