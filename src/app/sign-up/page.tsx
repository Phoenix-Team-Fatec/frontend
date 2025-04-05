'use client'

import { useState, useCallback, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { checkPasswordStrength, getPasswordStrengthColor } from "@/lib/password-checker";
import Popup from "@/components/Feedback/popup";

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
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [previousCroppedImage, setPreviousCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);
    
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    const showMessagePopup = (message: string, success: boolean) => {
        setPopupMessage(message);
        setIsSuccess(success);
        setShowPopup(true);
        
        if (success) {
            setTimeout(() => {
                setShowPopup(false);
                if (message === "Usuário criado com sucesso") {
                    window.location.href = "/sign-in";
                }
            }, 3000);
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
            setCroppedImage(croppedImg);
            setShowCropper(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwordStrength.score < 3) {
            showMessagePopup("Por favor, use uma senha mais forte: " + passwordStrength.feedback, false);
            return;
        }

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
            showMessagePopup("Usuário criado com sucesso", true);
        } catch (error: any) {
            console.error("Erro ao criar usuário", error.response?.data || error.message);

            if (error.response && error.response.data) {
                const errorMessage = error.response?.data?.details?.code || error.response?.data?.error;

                if (errorMessage === "Já existe um usuário com esse email") {
                    showMessagePopup("Já existe um usuário com esse email", false);
                } else if (errorMessage.includes("auth/weak-password")) {
                    showMessagePopup("A senha fornecida é muito fraca", false);
                } else {
                    showMessagePopup("Erro: " + errorMessage, false);
                }
            } else {
                showMessagePopup("Erro ao criar usuário: " + error.message, false);
            }
        }
    };

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
                        <h1 className="text-3xl font-bold tracking-tighter">Bem-vindo ao Lumen!</h1>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex space-x-3">
                            <div className="space-y-2">
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
                            {/* Password strength indicator */}
                            {password.length > 0 && (
                                <div className="mt-1 space-y-1">
                                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${getPasswordStrengthColor(passwordStrength.score, password.length)} transition-all duration-300`} 
                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600">{passwordStrength.feedback}</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">Foto de Perfil</Label>
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
                                        Salvar
                                    </Button>
                                    <Button type="button" className="bg-red-500 w-1/2" onClick={() => setShowCropper(false)}>
                                        Fechar
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-[#355EAF] cursor-pointer hover:bg-[#2d4f95]">
                            Cadastra-se
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Já tem uma conta?{" "}
                        <a
                            href="/sign-in"
                            className="text-primary-500 hover:text-primary-600 font-medium hover:underline"
                        >
                            Entrar
                        </a>
                    </div>
                </div>
        </div>
    );
}