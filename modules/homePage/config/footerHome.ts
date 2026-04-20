import { Facebook, Instagram, Linkedin } from "lucide-react";
import type {
  FooterSocialLink,
  FooterNavColumn,
  FooterLegalLink,
} from "../types/typesHome";

export const footerSocialLinks: FooterSocialLink[] = [
  {
    id: "footer-social-facebook",
    href: "#",
    ariaLabel: "Fluvoo en Facebook",
    icon: Facebook,
  },
  {
    id: "footer-social-instagram",
    href: "#",
    ariaLabel: "Fluvoo en Instagram",
    icon: Instagram,
  },
  {
    id: "footer-social-linkedin",
    href: "#",
    ariaLabel: "Fluvoo en LinkedIn",
    icon: Linkedin,
  },
];

export const footerNavColumns: FooterNavColumn[] = [
  {
    title: "Producto",
    links: [
      { id: "footer-link-caracteristicas", label: "Características", href: "#" },
      { id: "footer-link-seguridad", label: "Seguridad", href: "#" },
      { id: "footer-link-integraciones", label: "Integraciones", href: "#" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { id: "footer-link-sobre-nosotros", label: "Sobre nosotros", href: "#" },
      { id: "footer-link-blog", label: "Blog", href: "#" },
      { id: "footer-link-contacto", label: "Contacto", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { id: "footer-link-documentacion", label: "Documentación", href: "#" },
      { id: "footer-link-comunidad", label: "Comunidad", href: "#" },
      { id: "footer-link-soporte", label: "Soporte", href: "#" },
    ],
  },
];

export const footerLegalLinks: FooterLegalLink[] = [
  { id: "footer-link-privacidad", label: "Privacidad", href: "/privacidad" },
  { id: "footer-link-terminos", label: "Términos", href: "/terminos" },
  { id: "footer-link-cookies", label: "Cookies", href: "/cookies" },
];
