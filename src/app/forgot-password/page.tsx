'use client'

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postData = {
            user_email: email
        }

        try {
            const response = await axios.post("http://localhost:3000/usuarios/reset-password", postData)
            console.log(response.data)
            alert("Email para recuperara senha enviado para: " + email)
            window.location.href = "/sign-in";
        } catch (error: any) {
            console.error("Erro ao recuperar senha de usuário", error.response?.data || error.message);

            if (error.response && error.response.data) {
                const errorMessage = error.response?.data?.details?.code || error.response?.data?.error;

                if (errorMessage.includes("User not found")) {
                    alert("Usuário não encontrado");
                };
            } else {
                alert("Erro ao criar usuário: " + error.message);
            }
        }
    }

    return (
        <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/sign.png')", 
            }}>
            <div className="bg-white rounded-2xl shadow-xl p-12 space-y-6 w-120">
                <div className="flex justify-center items-center">
                    <img 
                        src="/forgot_password2.png" 
                        className="h-40 transform rotate-" 
                        alt="Forgot Password"
                    />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Esqueceu sua senha?</h1>
                    <p className="text-muted-foreground">Digite o e-mail para o qual deseja receber as instruções de redefinição de senha.</p>
                </div>
                <form onSubmit={handleSubmit}>
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
                    <Button type="submit" className="w-full bg-[#355EAF] mt-8 cursor-pointer hover:bg-[#2d4f95]">
                        Solicitar link de redefinição
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <a href="/sign-in" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">Voltar para o login</a>
                </div>
            </div>
        </div>
    )
}
