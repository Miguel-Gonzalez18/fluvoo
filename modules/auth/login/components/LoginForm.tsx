"use client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/modules/homePage/components/ui/button";
import { AuthInput } from "./ui/AuthInput";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { loginConfig } from "../config/loginConfig";
import type { LoginSchemaOutput } from "../lib/loginSchemas";
import { sileo } from "sileo"
import Image from "next/image";
import Link from "next/link";

export function LoginForm() {
  const { showPassword, toggle } = usePasswordToggle();
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm();

  const onSubmit = async (data: LoginSchemaOutput) => {
    // TODO: Implementar lógica de autenticación cuando haya servidor
    console.log(data);
    sileo.success({ title: "Sesión iniciada correctamente!" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-5" noValidate>
      <Link href="/" className="block lg:hidden">
        <Image src="/logo.svg" alt="Fluvoo" width={100} height={100} className="w-[100px] h-auto object-contain" />
      </Link>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-neutral-900">
          {loginConfig.title}
        </h1>
        <p className="text-sm text-neutral-500">{loginConfig.subtitle}</p>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button
          type="button"
          variant="outline"
          className="bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-medium"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-black border-neutral-200 hover:bg-neutral-800 text-white hover:text-gray font-medium"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-medium"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022"/>
            <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00"/>
            <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF"/>
            <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900"/>
          </svg>
          Microsoft
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-50 px-2 text-neutral-500">o</span>
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
          {loginConfig.emailLabel}
        </label>
        <AuthInput
          icon={Mail}
          type="email"
          placeholder={loginConfig.emailPlaceholder}
          {...register("email")}
          error={errors.email?.message}
          autoComplete="email"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
            {loginConfig.passwordLabel}
          </label>
          <a
            href="/recuperar"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            {loginConfig.forgotPasswordLabel}
          </a>
        </div>
        <div className="relative">
          <AuthInput
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder={loginConfig.passwordPlaceholder}
            {...register("password")}
            error={errors.password?.message}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-12 cursor-pointer">
        {loginConfig.submitLabel}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        {loginConfig.registerLabel}{" "}
        <a
          href="/register"
          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          {loginConfig.registerLinkLabel}
        </a>
      </p>
    </form>
  );
}