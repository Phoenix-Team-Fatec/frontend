'use client'

import { useState } from "react";
import {motion} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    return (

        <div className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat" 
        style={{
            backgroundImage: "url('/sign.png')", 
          }}>

        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Forgot your password</h1>
                        <p className="text-muted-foreground">Enter the email address you'd like your password reset information set to</p>
                    </div>
                    <form>
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
        </div>
    )
}