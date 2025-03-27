import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const secretKey = "74b94f6e852f831521bba51e73fe4d5a";

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const encryptedData = sessionStorage.getItem("userData");
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData);
      } catch (error) {
        console.error("Erro ao descriptografar os dados:", error);
        sessionStorage.removeItem("userData");
      }
    }
  }, []);

  return user;
}
