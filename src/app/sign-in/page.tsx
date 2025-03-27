'use client'

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import CryptoJS from "crypto-js";
import axios from "axios";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const postData = {
            user_email: email,
            password: password
        }

        try {
            const response = await axios.post("http://localhost:3000/usuarios/login", postData)
            console.log("Login realizado com sucesso", response.data)

            const secretKey = "74b94f6e852f831521bba51e73fe4d5a";

            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(response.data.user),
                secretKey
            ).toString();

            sessionStorage.setItem("userData", encryptedData);
        } catch (error) {
            console.error(error)
            alert("Erro ao fazer login verifique os dados ou tente novamente mais tarde")
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
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                        <div className="flex justify-end">
                            <a href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">forgot password?</a>
                        </div>
                        <Button type="submit" className="w-full bg-[#355EAF] cursor-pointer hover:bg-[#2A52A2]">
                            Sing in
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <a
                            href="/sign-up"
                            className="text-primary-500 hover:text-primary-600 font-medium"
                        >
                            Sign up
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}