import { BookOpen, Ear, Eye, Hand, type LucideIcon, Sparkles } from "lucide-react";

const iconsByName: Record<string, LucideIcon> = {
  visual: Eye,
  auditory: Ear,
  "reading/writing": BookOpen,
  kinesthetic: Hand,
};

export const learningStyleIcon = (name: string | undefined): LucideIcon =>
  (name && iconsByName[name.toLowerCase()]) || Sparkles;

export const learningStyleLabel = (name: string | undefined) =>
  name ? `For ${name.toLowerCase()} learners` : "Another way to learn this";
