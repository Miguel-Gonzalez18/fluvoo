import Image from "next/image";

const logos = [
    { src: "/images/entidades-financieras-logos/banco-popular.png",  alt: "Banco Popular Dominicano" },
    { src: "/images/entidades-financieras-logos/banreservas.png",     alt: "Banreservas" },
    { src: "/images/entidades-financieras-logos/APAP.png",            alt: "APAP" },
    { src: "/images/entidades-financieras-logos/Banco_BHD.webp",      alt: "BHD" },
    { src: "/images/entidades-financieras-logos/Scotiabank.svg",      alt: "Scotiabank", sizeClass: "h-5" },
    { src: "/images/entidades-financieras-logos/Banco_Caribe.svg",    alt: "Banco Caribe" },
    { src: "/images/entidades-financieras-logos/Banesco_Banco.svg",   alt: "Banesco" },
    { src: "/images/entidades-financieras-logos/Santa-Cruz.svg",      alt: "Banco Santa Cruz" },
];

export function BankCarousel() {
    return (
        <div className="w-full mt-6 space-y-8">
            {/* Label */}
            <p className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest text-center md:text-left">
                Compatible con los principales bancos de RD
            </p>

            {/* Track container — overflow hidden + edge fade masks */}
            <div
                className="relative overflow-hidden"
                style={{
                    maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
            >
                {/* Scrolling track — duplicated logos for seamless infinite loop */}
                <div
                    className="flex w-max items-center gap-8 hover:paused"
                    style={{ animation: "marquee 22s linear infinite" }}
                >
                    {/* Two identical copies → animation moves -50% → seamless */}
                    {[...logos, ...logos].map((logo, i) => (
                        <div
                            key={i}
                            className="flex shrink-0 items-center justify-center px-2"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={90}
                                height={36}
                                className={`${logo.sizeClass ?? "h-7"} w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0`}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
