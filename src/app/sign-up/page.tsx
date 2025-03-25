'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [photo, setPhoto] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);

            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat" 
        style={{
            backgroundImage: "url('/sign.png')", 
          }}>

        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                transition={{ duration: 0.5}}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Bem-vindo ao Lumen!</h1>
                        <p></p>
                    </div>
                    <form className="space-y-4">
                        <div className="flex space-x-2">
                            <div className=" space-y-2">
                                <Label htmlFor="firstName">Nome</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Sobrenome</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Digite seu sobrenome"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="teste@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo"> Foto de Perfil</Label>
                            <Input
                                id="photo" 
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[#355EAF] cursor-pointer">
                            Cadastrar-se
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Já tem uma conta?{" "}
                        <a
                            href="/sign-in"
                            className="text-primary-500 hover:text-primary-600 font-medium"
                        >
                            Entrar
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
        </div>
    )
}
