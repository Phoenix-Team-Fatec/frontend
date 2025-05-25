"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Camera, Save } from "lucide-react";
import { useUser } from "@/hook/UserData";
import CryptoJS from "crypto-js";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter()
  const user = useUser();

  // User data state
  const [userData, setUserData] = useState({
    user_nome: "",
    user_sobrenome: "",
    user_email: ""
  });

  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize sidebar state from localStorage before rendering
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarState = localStorage.getItem("sidebarOpen");
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === "true");
      }
      setInitialized(true);
    }
  }, []);

  // Initialize user data when user object changes
  useEffect(() => {
    if (user) {
      setUserData({
        user_nome: user.user_nome || "",
        user_sobrenome: user.user_sobrenome || "",
        user_email: user.user_email || ""
      });
    }
  }, [user]);

  // Handle profile changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_nome", userData.user_nome);
      formData.append("user_sobrenome", userData.user_sobrenome);
      formData.append("user_email", userData.user_email);

      if (avatarFile) {
        formData.append("user_foto", avatarFile, avatarFile.name);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.put(`http://localhost:3000/usuarios/${user.user_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const secretKey = "74b94f6e852f831521bba51e73fe4d5a";
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(response.data),
        secretKey
      ).toString();

      sessionStorage.setItem("userData", encryptedData);
      setCookie("userData", encryptedData, {
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialized) {
    return null;
  }

  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`w-full p-8 ${contentMargin}`}>
        <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
        <div>
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                    <AvatarImage src={avatarPreview || user?.user_foto || ""} alt="user" />
                    <AvatarFallback className="text-2xl bg-[#355EAF] text-white">
                      {user?.user_nome?.[0] || ""}{user?.user_sobrenome?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-[#355EAF] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#2C4B8B] transition-colors">
                    <Camera size={16} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                    <Label htmlFor="user_nome">Nome</Label>
                    <Input
                      id="user_nome"
                      name="user_nome"
                      value={userData.user_nome}
                      onChange={handleProfileChange}
                      placeholder="Seu user_nome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_sobrenome">Sobrenome</Label>
                    <Input
                      id="user_sobrenome"
                      name="user_sobrenome"
                      value={userData.user_sobrenome}
                      onChange={handleProfileChange}
                      placeholder="Seu user_sobrenome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_email">Email</Label>
                    <Input
                      id="user_email"
                      name="user_email"
                      type="email"
                      value={userData.user_email}
                      onChange={handleProfileChange}
                      placeholder="seu@user_email.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-6">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-[#C5D8FF] text-[#355EAF] hover:bg-[#97b0e7] hover:text-[#37537c] cursor-pointer"
              >
                {isLoading ? (
                  "Salvando..."
                ) : isSaved ? (
                  <span className="flex items-center gap-2">
                    <Save size={16} /> Salvo!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={16} /> Salvar Alterações
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}