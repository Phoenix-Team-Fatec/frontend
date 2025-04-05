import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import CryptoJS from "crypto-js";

export const logout = () => {
    sessionStorage.removeItem("userData");
    deleteCookie("userData");
    
    window.location.href = "/sign-in";
}

export const useLogout = () => {
    const router = useRouter();

    return () => {
        sessionStorage.removeItem("userData");
        deleteCookie("userData");

        router.push("/sign-in");
    }
}

export const getUserData = () => {
    if (typeof window === "undefined") {
        return null;
    }

    const userData = sessionStorage.getItem("userData");
    if(!userData) {
        return null
    }

    try {
        const secretKey = "74b94f6e852f831521bba51e73fe4d5a";
        const decryptedBytes = CryptoJS.AES.decrypt(userData, secretKey);
        const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (error) {
        console.error('Error decrypting user data:', error);
        return null;
      }
}