import { Variants } from "motion/react";

export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string
    description: string;
    className?: string
    gradient?: string;
    status?: 'completed' | 'inProgress' | 'comingSoon';
    variants?: Variants;
}