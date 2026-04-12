"use client";
import TextPressure from "@/components/ui/TextPressure";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { 
  Facebook, 
  Instagram, 
  Linkedin,
} from "lucide-react";

export function Footer() {
  useEffect((): () => void => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Animación de las columnas del footer
    gsap.from('.footer-section', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-content',
        start: 'top 80%',
      },
    });

    return () => {};
  }, []);

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      <div className="relative z-10">
        {/* Sección principal del footer */}
        <div className="mx-auto max-w-full text-center md:text-left px-4 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 footer-content">
            
            {/* Columna 1: Logo y descripción */}
            <div className="footer-section text-center md:text-left space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Image src="/logo-White.svg" alt="Fluvoo" width={100} height={100} />
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                La forma más inteligente de entender tus finanzas. Sin hojas de cálculo, sin complicaciones.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <a id="footer-social-facebook" href="https://facebook.com/fluvoo" aria-label="Fluvoo en Facebook" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors">
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a id="footer-social-instagram" href="https://instagram.com/fluvoo" aria-label="Fluvoo en Instagram" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a id="footer-social-linkedin" href="https://linkedin.com/company/fluvoo" aria-label="Fluvoo en LinkedIn" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors">
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Columna 2: Producto */}
            <div className="footer-section space-y-6">
              <h3 className="text-lg font-semibold">Producto</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a id="footer-link-caracteristicas" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a id="footer-link-seguridad" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Seguridad
                  </a>
                </li>
                <li>
                  <a id="footer-link-integraciones" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Integraciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Compañía */}
            <div className="footer-section space-y-6">
              <h3 className="text-lg font-semibold">Compañía</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a id="footer-link-sobre-nosotros" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a id="footer-link-blog" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a id="footer-link-contacto" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 4: Recursos */}
            <div className="footer-section space-y-6">
              <h3 className="text-lg font-semibold">Recursos</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a id="footer-link-documentacion" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a id="footer-link-comunidad" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a id="footer-link-soporte" href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-neutral-800">
          <div className="mx-auto max-w-full px-4 md:px-12 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-semibold mb-2">Mantente actualizado</h3>
                <p className="text-neutral-400 text-sm">
                  Recibe las últimas noticias y actualizaciones de Fluvoo
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  id="footer-newsletter-email"
                  name="newsletter-email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button id="footer-newsletter-submit" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-y border-neutral-800">
          <div className="mx-auto max-w-full px-4 md:px-12 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center gap-6 text-neutral-400 text-xs">
                <span className="flex gap-2">© 2026 Fluvoo. Todos los derechos reservados. Hecho en <Image src="/images/banderaDo.png" alt="Bandera de República Dominicana" width={15} height={15} /></span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span>Creado por</span>
                <a id="footer-link-miguelcode" href="https://miguelcode.com" target="_blank" className="text-primary-400 hover:text-primary-300 transition-colors text-xs">miguelcode.com
                </a>
              </div>
              <div className="flex gap-6">
                <a id="footer-link-privacidad" href="#" className="text-neutral-400 hover:text-white transition-colors text-xs">
                  Privacidad
                </a>
                <a id="footer-link-terminos" href="#" className="text-neutral-400 hover:text-white transition-colors text-xs">
                  Términos
                </a>
                <a id="footer-link-cookies" href="#" className="text-neutral-400 hover:text-white transition-colors text-xs">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-8">
          <TextPressure
            text="Fluvoo"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#048059"
            strokeColor="#5227FF"
            minFontSize={36}
          />
        </div>
      </div>
    </footer>
  );
}
