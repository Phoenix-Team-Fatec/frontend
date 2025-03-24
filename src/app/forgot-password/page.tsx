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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Forgot your password</h1>
                        <p className="text-muted-foreground">Enter the email address you'd like your password reset information set to</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="teste@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[#355EAF] mt-8 cursor-pointer">
                            Request reset link
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        <a href="/sign-in" className="text-primary-500 hover:text-primary-600 font-medium">Back To Login</a>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}