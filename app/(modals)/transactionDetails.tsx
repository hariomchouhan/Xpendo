import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ModalWrapper from "@/components/ModalWrapper";
import BackButton from "@/components/BackButton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Header from "@/components/Header";
import { expenseCategories, incomeCategory } from "@/constants/data";
import { scale, verticalScale } from "@/utils/styling";
import {
  CalendarBlank,
  DownloadSimple,
  FileText,
  Trash,
  Wallet,
} from "phosphor-react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useState } from "react";
import { currentCurrency } from "@/constants/currency";
import useFetchWalletName from "@/hooks/useFetchWalletName";
import { deleteTransaction } from "@/services/transactionService";

export default function TransactionDetails() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  type paramType = {
    id: string;
    category: string;
    date: string;
    amount: string;
    type: string;
    description: string;
    walletId: string;
    image: any;
  };
  const {
    id,
    category: categoryName,
    walletId,
    date,
    description,
    amount,
    type,
    image,
  }: paramType = useLocalSearchParams();
  const category =
    type === "income" ? incomeCategory : expenseCategories[categoryName!];
  const IconComponent = category.icon;
  const {
    data: walletName,
    error,
  } = useFetchWalletName("wallets", walletId);

  const saveToGallery = async (fileUri: any) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Saved to Gallery");
    } else {
      Alert.alert("Permission Denied");
    }
  };

  const downloadImage = async () => {
    const imageUrl = image;
    const fileUri = FileSystem.documentDirectory + "downloaded-image.png";

    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      saveToGallery(uri);
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Download Failed", "Something went wrong.");
    }
  };

  const onDelete = async () => {
    // console.log("deleting wallet: ", oldWallet?.id);
    if (!walletId) return;

    setLoading(true);
    const res = await deleteTransaction(id, walletId);
    setLoading(false);
    if (res?.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res?.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet? \nThis action will remove all the transactions associated with this wallet.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDelete();
          },
          style: "destructive",
        },
      ]
    );
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title={"Transaction Details"} leftIcon={<BackButton />} />
        <ScrollView
          contentContainerStyle={{
            gap: scale(30),
            marginTop: verticalScale(25),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.amount,
                { color: type === "income" ? colors.green : colors.rose },
              ]}
            >
              {type === "income" ? "+ " : "- "}
              {currentCurrency}
              <Text style={{ fontWeight: "800" }}>{amount}</Text>
            </Text>
            <Text style={styles.type}>
              {type === "expense" ? "Expense" : "Income"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            {categoryName && (
              <View style={styles.itemContainer}>
                {IconComponent && (
                  <IconComponent
                    size={verticalScale(25)}
                    weight="fill"
                    color={colors.white}
                  />
                )}
                <View style={styles.labelValueWapper}>
                  <Text style={styles.label}>Category</Text>
                  <Text style={styles.value}>{categoryName}</Text>
                </View>
              </View>
            )}

            <View style={styles.itemContainer}>
              <Wallet
                size={verticalScale(25)}
                weight="fill"
                color={colors.white}
              />
              <View style={styles.labelValueWapper}>
                <Text style={styles.label}>Wallet</Text>
                <Text style={styles.value}>{walletName}</Text>
              </View>
            </View>

            <View style={styles.itemContainer}>
              <CalendarBlank
                size={verticalScale(25)}
                weight="fill"
                color={colors.white}
              />
              <View style={styles.labelValueWapper}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{date}</Text>
              </View>
            </View>

            {description !== "" && (
              <View
                style={[
                  styles.itemContainer,
                  { alignItems: "flex-start", paddingTop: verticalScale(8) },
                ]}
              >
                <FileText
                  size={verticalScale(25)}
                  weight="fill"
                  color={colors.white}
                />
                <View style={styles.labelValueWapper}>
                  <Text style={styles.label}>Description</Text>
                  <Text
                    style={[
                      styles.value,
                      { marginRight: verticalScale(35), textAlign: "justify" },
                    ]}
                  >
                    {description}
                  </Text>
                </View>
              </View>
            )}

            {image && (
              <View
                style={[
                  styles.imageContainer,
                  { marginTop: verticalScale(10) },
                ]}
              >
                <Image
                  style={{ flex: 1 }}
                  source={image}
                  contentFit="cover"
                  transition={100}
                />
                <TouchableOpacity
                  style={styles.downloadIcon}
                  onPress={downloadImage}
                >
                  <DownloadSimple
                    size={verticalScale(25)}
                    weight="fill"
                    color={colors.white}
                    // style={{backgroundColor: }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {id && !loading && (
          <Button
            onPress={showDeleteAlert}
            loading={loading}
            style={{
              flex: 0.4,
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    marginBottom: verticalScale(10),
  },
  priceContainer: {
    flex: 1,
    alignItems: "center",
    gap: scale(8),
  },
  amount: {
    fontSize: 30,
  },
  type: {
    fontSize: 16,
    color: colors.neutral300,
    marginBottom: verticalScale(20),
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: colors.neutral700,
    padding: verticalScale(15),
    borderRadius: radius._10,
    marginBottom: Platform.OS === "ios" ? verticalScale(20) : verticalScale(50),
    gap: scale(6),
  },
  itemContainer: {
    flexDirection: "row",
    gap: scale(6),
    alignItems: "center",
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: verticalScale(4),
    paddingLeft: verticalScale(8),
  },
  labelValueWapper: {
    gap: scale(6),
  },
  label: {
    color: colors.neutral600,
    fontSize: 16,
  },
  value: {
    color: colors.white,
    fontSize: 16,
    marginBottom: verticalScale(10),
  },
  imageContainer: {
    height: verticalScale(200),
    width: verticalScale(200),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  downloadIcon: {
    position: "absolute",
    right: spacingY._5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: scale(12),
  },
  button: {
    paddingHorizontal: verticalScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: radius._10,
  },
  deleteButton: {
    backgroundColor: colors.rose,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
});
