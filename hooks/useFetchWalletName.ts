import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

type Props = {};

const useFetchWalletName = (collectionName: string, walletId: string) => {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetch = async() => {
    try {
    if (!collectionName) return;

        const docRef = doc(firestore, collectionName, walletId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const data = docSnap.data();
            setData(data?.name)
        } else {
          console.log("No such document!");
          setError("No such document!")
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
  }
  useEffect(() => {
    fetch()
  }, []);
  return { data, error };
};

export default useFetchWalletName;
