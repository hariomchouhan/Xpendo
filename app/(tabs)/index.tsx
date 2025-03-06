import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import { MagnifyingGlass, Plus } from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType, WalletType } from "@/types";

type Props = {};

const Home = (props: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recentTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);

  const { data: wallets } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchIcon}
          >
            <MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage={
              wallets.length === 0
                ? "Firstly Create wallet!"
                : "No Transactions added yet!\n Add money to your wallet"
            }
            title="Recent Transactions"
          />
          {wallets.length === 0 && (
            <Button
              style={{ width: verticalScale(180), alignSelf: "center" }}
              onPress={() => router.push("/(tabs)/wallet")}
            >
              <Typo fontWeight={"500"}>Create Wallet</Typo>
            </Button>
          )}
        </ScrollView>

        {wallets.length !== 0 && (
          <Button
            style={styles.floatingButton}
            onPress={() => router.push("/(modals)/transactionModal")}
          >
            <Plus color={colors.black} weight="bold" size={verticalScale(24)} />
          </Button>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});

export default Home;
