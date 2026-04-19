"use client";
import { BadgeDollarSign, Check } from "lucide-react";
import Image from "next/image";
import { profilesData } from "../config/profilesHome";
import { useSectionRevealHome } from "../hooks/useSectionRevealHome";

export function Profiles() {
  useSectionRevealHome({
    headerTrigger: '#profiles-title',
    titleSelector: '#profiles-title',
    subtitleSelector: '#profiles-subtitle',
    descriptionSelector: '#profiles-paragraph',
    cardSelector: '.profile-card',
    containerSelector: '.profiles-grid',
    order: 'title-subtitle-desc',
    titleSlide: 'y',
  });

  return (
    <section className="w-full py-20 space-y-12 relative">
        {/* Patrón decorativo de fondo */}
        <div className="pointer-events-none hidden lg:block absolute inset-0">
            {/* Cuadrícula: líneas blancas sobre fondo blanco */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
        </div>
        {/* Icono de fondo inferior derecha con opacidad */}
        <div className="pointer-events-none absolute top-0 right-0 opacity-0 md:opacity-10">
            <BadgeDollarSign className="w-96 h-96" />
        </div>
        <div className="mx-auto max-w-full space-y-1 px-4 md:px-12 relative text-center md:text-left">
            <p className="text-md text-primary" id="profiles-subtitle">Hecho para ti</p>
            <h2 className="text-3xl font-heading text-neutral-800 font-bold" id="profiles-title">Una app que se <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">adapta</span> a tu <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">situación</span></h2>
            <p className="text-md text-neutral-600" id="profiles-paragraph">No importa cómo generes tus ingresos. Fluvoo tiene un perfil diseñado para tu realidad.</p>
        </div>

        {/* Cards de perfiles, empleado asalariado, freelance, dueño de empresa */}
        <div className="mx-auto max-w-full space-y-1 px-4 md:px-12 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 profiles-grid">
                {profilesData.map((profile) => {
                    const Icon = profile.icon;
                    return (
                        <div id={`profile-card-${profile.id}`} key={profile.id} className="bg-white p-6 rounded-xl border-y-2 border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 relative space-y-4 profile-card hover:border-primary">
                            <div className="flex items-center justify-between">
                                {profile.badges ? (
                                    <div className="space-x-2">
                                        {profile.badges.map((badge, index) => (
                                            <span 
                                                key={index}
                                                className={`bg-${badge.color} text-white text-xs font-semibold px-2 py-1 rounded-full`}
                                            >
                                                {badge.text}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className={`bg-${profile.badge!.color} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                                        {profile.badge!.text}
                                    </span>
                                )}
                                <Image 
                                    src={profile.image} 
                                    alt={profile.imageAlt} 
                                    width={profile.imageSize.width} 
                                    height={profile.imageSize.height} 
                                    unoptimized
                                />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-800">{profile.title}</h3>
                            </div>
                            <p className="text-neutral-600 mb-4 text-sm leading-relaxed">{profile.description}</p>
                            <ul className="space-y-3">
                                {profile.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-sm text-neutral-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
  );
}