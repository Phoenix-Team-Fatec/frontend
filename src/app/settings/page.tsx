"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Camera, Save } from "lucide-react";
import { useUser } from "@/hook/UserData";
import Cropper from "react-easy-crop";
import axios from "axios";
import { Upload } from "lucide-react";

async function getCroppedImg(imageSrc: string, crop: any) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
  );

  return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
          if (blob) {
              const croppedUrl = URL.createObjectURL(blob);
              resolve(croppedUrl);
          }
      }, "image/jpeg");
  });
}


export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [previousCroppedImage, setPreviousCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  // User data state
  const [userData, setUserData] = useState({
    nome: "",
    sobrenome: "",
    email: ""
  });
  const user = useUser();

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
        nome: user.user_nome || "",
        sobrenome: user.user_sobrenome || "",
        email: user.user_email || ""
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



  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_nome", userData.nome);
      formData.append("user_sobrenome", userData.sobrenome);
  
      if (avatarFile) {
        formData.append("user_foto", avatarFile); // ✅ Nome correto
      }
  
      const response = await axios.put(
        `http://localhost:3000/usuarios/${Number(user.user_id)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log(response.data);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length == 0) {
          return
      }

      const file = e.target.files?.[0];

      setPhoto(file)
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL)

      setCroppedImage(null)
      setPreviousCroppedImage(null)

      setShowCropper(true)
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
          setCroppedAreaPixels(croppedAreaPixels);
      }, []);


      const handleCropSave = async () => {
        if (preview && croppedAreaPixels) {
          const croppedImg = await getCroppedImg(preview, croppedAreaPixels);
      
          if (croppedImg) {
            const response = await fetch(croppedImg);
            const blob = await response.blob();
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
            console.log(avatarFile)
            setAvatarFile(file); // define o arquivo final
            setAvatarPreview(URL.createObjectURL(file)); // exibe preview
            setShowCropper(false);
          }
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
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                {showCropper && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md shadow-md w-[90%] max-w-xl">
                      <div className="relative w-full h-[400px]">
                        <Cropper
                          image={preview!}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button onClick={() => setShowCropper(false)} variant="outline">Cancelar</Button>
                        <Button onClick={handleCropSave} className="bg-[#355EAF] text-white hover:bg-[#2C4B8B]">Cortar e Salvar</Button>
                      </div>
                    </div>
                  </div>
                )}

                
                 <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input 
                      id="nome" 
                      name="nome" 
                      value={userData.nome} 
                      onChange={handleProfileChange}
                      placeholder="Seu nome" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input 
                      id="sobrenome" 
                      name="sobrenome" 
                      value={userData.sobrenome} 
                      onChange={handleProfileChange}
                      placeholder="Seu sobrenome" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={userData.email} 
                      onChange={handleProfileChange}
                      placeholder="seu@email.com" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-6">
              <Button 
                onClick={() => handleUpdate()} 
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