'use client'

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Popup from "@/components/Feedback/popup";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    const showMessagePopup = (message: string, success: boolean) => {
        setPopupMessage(message);
        setIsSuccess(success);
        setShowPopup(true);
        
        if (success) {
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postData = {
            user_email: email,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:3000/usuarios/login", postData)
            
            const secretKey = "74b94f6e852f831521bba51e73fe4d5a";
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(response.data.user),
                secretKey
            ).toString();
            
            sessionStorage.setItem("userData", encryptedData);
            setCookie("userData", encryptedData, {
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            showMessagePopup("Login realizado com sucesso!", true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
            
        } catch (error: any) {
            console.error(error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    showMessagePopup("E-mail ou senha incorretos", false);
                } else {
                    showMessagePopup("Erro ao fazer login: " + error.response.data?.message, false);
                }
            } else {
                showMessagePopup("Erro ao conectar com o servidor. Tente novamente mais tarde.", false);
            }
        }
    }

    return (
        <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat" 
            style={{
                backgroundImage: "url('/sign.png')", 
            }}>

            <Popup 
                isOpen={showPopup}
                message={popupMessage}
                isSuccess={isSuccess}
                onClose={() => setShowPopup(false)}
            />

            <div className="bg-white rounded-xl shadow-xl p-12 space-y-6 w-120">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Bem-vindo de volta</h1>
                    <p className="text-muted-foreground">Insira suas credenciais para acessar sua conta</p>
                </div>
                <div className="rounded-xs">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="teste@email.com"
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
                                    placeholder="******"
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
                        <div className="flex justify-end">
                            <a href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">Esqueceu sua senha?</a>
                        </div>
                        <Button type="submit" className="w-full bg-[#355EAF] cursor-pointer hover:bg-[#2d4f95]">
                            Entrar
                        </Button>
                    </form> 
                </div>
                <div className="text-center text-sm">
                    Não tem uma conta?{" "}
                    <a
                        href="/sign-up"
                        className="text-primary-500 hover:text-primary-600 font-medium hover:underline"
                    >
                        Cadastre-se
                    </a>
                </div>
            </div> 
        </div>
    );
}