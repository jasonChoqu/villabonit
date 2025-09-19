import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { login } from '@/core/reducer/auth.reducer';
import { toastify } from "@/core/utils/toastify";

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const resultAction = await dispatch(login({
      email: formData.email,
      password: formData.password
    }));

    setIsLoading(false);

    if (login.fulfilled.match(resultAction)) {
      toastify.success("Inicio de sesión correctamente")
      navigate('/admin');
    } else {
      toastify.error(resultAction.payload as string);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
         <Link
      to="/"
      className="inline-flex items-center mb-6 text-green-600 hover:text-green-800 transition-colors"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Volver al inicio
    </Link>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¡Introduce tu email y contraseña para iniciar sesión!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo Electrónico <span className="text-error-500">*</span>
                  </Label>
                  <Input 
                    name="email"
                    type="email"
                    placeholder="Ingresa tu email" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeClosedIcon className="dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-green-500 hover:text-green-600 dark:text-green-400"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <Button disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500" size="sm" type="submit">
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner"></span>loading
                      </>
                    ) : (
                      <span>Iniciar Sesión</span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
