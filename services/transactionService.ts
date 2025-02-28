import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./ImageService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    if (id) {
      // todo: updating existing transaction
    } else {
      // update wallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) {
        return res;
      }
    }

    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes?.msg || "Failed to upload receipt",
        };
      }
      transactionData.image = imageUploadRes?.data;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef?.id },
    };
  } catch (error: any) {
    console.log("error creating or updating transaction: ", error.message);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      console.log("error updating wallet for new transaction");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapShot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance",
      };
    }

    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });
    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction: ", error.message);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const walletRef = doc(firestore, "wallets", walletId);

    await runTransaction(firestore, async (transaction) => {
      // Fetch transaction details
      const transactionSnap = await transaction.get(transactionRef);
      if (!transactionSnap.exists()) throw new Error("Transaction not found!");

      const { amount: transactionAmount, type } = transactionSnap.data();

      // Fetch wallet details
      const walletSnap = await transaction.get(walletRef);
      if (!walletSnap.exists()) throw new Error("Wallet not found!");

      const { amount, totalIncome, totalExpenses } = walletSnap.data();

      // Ensure values are numbers
      let updatedAmount = Number(amount) || 0;
      let updatedTotalIncome = Number(totalIncome) || 0;
      let updatedTotalExpenses = Number(totalExpenses) || 0;

      // Update amount based on transaction type
      if (type === "income") {
        updatedAmount -= transactionAmount;
        updatedTotalIncome -= transactionAmount;
      } else if (type === "expense") {
        updatedAmount += transactionAmount;
        updatedTotalExpenses -= transactionAmount;
      }

      // Prevent negative values
      if (updatedAmount < 0) throw new Error("Insufficient funds!");

      // Update wallet and delete transaction
      transaction.update(walletRef, {
        amount: updatedAmount,
        totalIncome: updatedTotalIncome,
        totalExpenses: updatedTotalExpenses,
      });
      transaction.delete(transactionRef);
    });

    console.log("✅ Transaction deleted & wallet updated!");
    return { success: true, msg: "Transaction deleted & wallet updated successfully 😊" };
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return { success: false, msg: `Error: ${error.message} 😔` };
  }
};


