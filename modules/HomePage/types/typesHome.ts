import type { LucideIcon } from "lucide-react";

export interface BenefitItem {
  icon: LucideIcon;
  label: string;
  cardTitle: string;
  cardImage: string;
  cardImageAlt: string;
  cardDescription: string;
}

export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface WhyFluvooCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProfileBadge {
  text: string;
  color: string;
}

export interface ProfileItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  imageSize: { width: number; height: number };
  badge?: ProfileBadge;
  badges?: ProfileBadge[];
  features: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
