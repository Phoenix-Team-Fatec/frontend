'use client'

import { useState, useCallback, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import axios from "axios";

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

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [previousCroppedImage, setPreviousCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);

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
            setCroppedImage(croppedImg);
            setShowCropper(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_nome", firstName);
        formData.append("user_sobrenome", lastName);
        formData.append("user_email", email);
        formData.append("password", password);

        if (croppedImage) {
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            formData.append("user_foto", blob, "cropped.jpg");
        }

        try {
            const response = await axios.post("http://localhost:3000/usuarios", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Usuário criado com sucesso", response.data);
            alert("Usuário criado com sucesso")
            window.location.href = "/sign-in";
        } catch (error: any) {
            console.error("Erro ao criar usuário", error.response?.data || error.message);

            if (error.response && error.response.data) {
                const errorMessage = error.response?.data?.details?.code || error.response?.data?.error;

                if (errorMessage === "Já existe um usuário com esse email") {
                    alert("Já existe um usuário com esse email");
                } else if (errorMessage.includes("auth/weak-password")) {
                    alert("A senha fornecida é muito fraca");
                } else {
                    alert("Erro: " + errorMessage);
                }
            } else {
                alert("Erro ao criar usuário: " + error.message);
            }
        }
    };

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
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome to Lumen</h1>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex space-x-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                        <div className="space-y-2">
                            <Label htmlFor="photo">Upload Photo</Label>
                            <div className="relative">
                                <Upload className="absolute left-2 top-1/2 transform -translate-y-1/2" size={20} />
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {showCropper && preview && (
                            <div className="mt-4 space-y-2">
                                <div className="relative w-full h-64 border rounded-md">
                                    <Cropper
                                        image={preview}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                                <div className="flex mt-2 justify-center space-x-2">
                                    <Button type="button" className="bg-green-500 w-1/2" onClick={handleCropSave}>
                                        Apply
                                    </Button>
                                    <Button type="button" className="bg-red-500 w-1/2" onClick={() => setShowCropper(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-[#355EAF] cursor-pointer hover:bg-[#2A52A2]">
                            Sign Up
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <a
                            href="/sign-in"
                            className="text-primary-500 hover:text-primary-600 font-medium"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
