"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Camera, Save } from "lucide-react";

export default function Settings() {
  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // User profile state
  const [userData, setUserData] = useState({
    nome: "Maria",
    sobrenome: "Silva",
    email: "maria.silva@example.com",
    avatar: ""
  });

  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarState = localStorage.getItem("sidebarOpen");
      if (savedSidebarState !== null) {
        setSidebarOpen(savedSidebarState === "true");
      }
    }
    
    // You would fetch the actual user data here
    // Example:
    // const fetchUserData = async () => {
    //   try {
    //     const { data } = await axios.get("http://localhost:3000/users/3");
    //     setUserData(data);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };
    // 
    // fetchUserData();
  }, []);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would actually save the data
      // Example:
      // await axios.put(`http://localhost:3000/users/3`, userData);
      
      // If avatar was changed
      // if (avatarFile) {
      //   const formData = new FormData();
      //   formData.append('avatar', avatarFile);
      //   await axios.post(`http://localhost:3000/users/3/avatar`, formData);
      // }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate content margin based on sidebar state
  const contentMargin = sidebarOpen ? "ml-[250px]" : "ml-[80px]";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`w-full p-8 transition-all duration-300 ${contentMargin} overflow-hidden`}>
        <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
        <div className="pr-8">
          <hr className="border-t-2 border-[#C4D8FF] my-4" />
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                    <AvatarImage src={avatarPreview || userData.avatar || undefined} />
                    <AvatarFallback className="text-2xl bg-[#355EAF] text-white">
                      {userData.nome[0]}{userData.sobrenome[0]}
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