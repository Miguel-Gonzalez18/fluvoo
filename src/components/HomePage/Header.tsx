"use client";
import Image from "next/image";
import { GetStartedButton } from "@/components/ui/get-started-button";
import Link from "next/link";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const itemsMenu = [
  { label: "Inicio", href: "#" },
  { label: "Nosotros", href: "#" },
  { label: "Planes", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contacto", href: "#" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      "#header",
      {
        duration: 0.5,
        y: -100,
        opacity: 0,
      },
      {
        duration: 0.5,
        y: 0,
        opacity: 1,
        ease: "power4.inOut",
        delay: 0.8,
      }
    );
  }, []);

  return (
    <header id="header" className="w-full px-2 py-4 fixed top-0 left-0 right-0 z-50">
      {/* desktop */}
      <div className="hidden md:flex mx-auto w-full max-w-3xl items-center justify-between px-2 py-3 rounded-lg bg-white shadow-sm border border-neutral-100">
        {/* logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Fluvoo" width={100} height={100} />
        </Link>

        {/* navigation */}
        <nav className="text-neutral-900 font-medium text-sm">
          <ul className="flex gap-6">
            {itemsMenu.map((item) => (
              <li key={item.label} className="hover:text-primary-600 transition-colors">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* cta */}
        <GetStartedButton />
      </div>

      {/* mobile */}
      <div className="md:hidden w-full rounded-xl bg-[#efefef] p-2 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between px-1 py-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/favicon.svg" alt="Fluvoo" width={25} height={25} />
            <span className="font-label text-xs font-semibold text-neutral-900">Fluvoo</span>
          </Link>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-neutral-800 px-2 text-xs font-medium text-white transition hover:bg-neutral-700"
          >
            {isMobileMenuOpen ? (
              <>
                <span>Close</span>
                <X size={14} />
              </>
            ) : (
              <>
                <span>Menu</span>
                <Menu size={14} />
              </>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-2 rounded-xl bg-black px-4 pb-4 pt-5 shadow-[0_18px_35px_rgba(0,0,0,0.35)]">
            <nav>
              <ul className="space-y-3 text-center">
                {itemsMenu.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 text-sm font-semibold text-white/95 transition hover:text-primary-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="rounded-md border border-white/20 px-2 py-2 text-xs font-medium text-white/90">
                Obtener prueba gratuita
              </button>
              <button className="rounded-md bg-white px-2 py-2 text-xs font-semibold text-black">
                Comenzar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}