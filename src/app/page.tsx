import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    ArrowRightIcon,
    CheckCircle2,
    Sparkles,
    Layers,
    Database,
    BarChart3,
    Zap,
    Wand2,
} from 'lucide-react';
import { FeatureCard } from '@/components/landingPage/feature-card';
import TemplateShowcase from '@/components/landingPage/template-showcase';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import { getAppOriginUrl } from '../utils/functions';
import PricingSection from '@/components/landingPage/pricing-section';
import { HeroVideoDialog } from '@/components/ui/VideoDialog';

const LINKS = {
    githubProfile: 'https://github.com/Avik-creator',
    projectRepo: 'https://github.com/Avik-creator/formcraftAI',
    signin: '/sign-in',
    templates: '/templates',
    dashboard: '/dashboard',
    aiFormBuilder: `/sign-in?redirect_url=${getAppOriginUrl()}?ai-form-builder=1`,
    signup: '/sign-up',
    portfolio: 'https://avikmukherjee.me',
    linkedinProfile: 'https://www.linkedin.com/in/avik-mukherjee-8ab9911bb',
};

const containerVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        filter: 'blur(10px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            staggerChildren: 0.1,
            type: 'spring' as const,
        },
    },
};

const childVariants = {
    hidden: { opacity: 0, y: -20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.5 },
    },
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white scroll-smooth">
            {/* Navbar */}
            <motion.header
                initial={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="container mx-auto py-6 px-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                   <Image src="/logo.webp" alt="FormCraft" width={32} height={32} />
                    <span className="font-bold text-xl">FormCraft</span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="#templates"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Templates
                    </a>
                    <a
                        href={LINKS.projectRepo}
                        className="text-gray-300 hover:text-white transition-colors"
                        target="_blank"
                    >
                        Github
                    </a>
                </nav>
                <div className="flex items-center gap-4">
                    <Button className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white">
                        <Link href={LINKS.signin}>Log in</Link>
                    </Button>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black/0 pointer-events-none"></div>
                <div className="absolute top-40 -left-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>
                <div className="absolute top-80 -right-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>

                <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-3xl mx-auto text-center mb-12"
                    >
                        
                        <motion.h1
                            variants={childVariants}
                            className="text-3xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500"
                        >
                            Build Beautiful Forms Without Code
                        </motion.h1>
                        <motion.p
                            variants={childVariants}
                            className="text-base md:text-xl text-gray-300 mb-8"
                        >
                            FormCraft is an AI powered no code drag-and-drop
                            form builder that helps you create stunning,
                            responsive forms with advanced features in minutes,
                            not hours.
                        </motion.p>
                        <motion.div
                            variants={childVariants}
                            className="flex flex-col gap-4 justify-center items-center"
                        >
                            <Button
                                size="lg"
                                className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                            >
                                <Link href={LINKS.signin}>
                                    Start Building for Free
                                </Link>
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Button>
                            
                                                <HeroVideoDialog
                                                    className="block dark:hidden"
                                                    animationStyle="from-center"
                                                    videoSrc="https://www.youtube.com/embed/QobiyTAybSg"
                                                    thumbnailSrc="https://formcraftai.avikmukherjee.me/og-image.png"
                                                    thumbnailAlt="Hero Video"
                                                />
                        <HeroVideoDialog
                                            className="hidden dark:block"
                                            animationStyle="from-center"
                                            videoSrc="https://www.youtube.com/embed/QobiyTAybSg"
                                            thumbnailSrc="https://formcraftai.avikmukherjee.me/og-image.png"
                                            thumbnailAlt="Hero Video"
                                        />
                           
                        </motion.div>
                    </motion.div>

                    
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="relative py-24 bg-gradient-to-b from-black to-zinc-900 overflow-hidden"
            >
                {/* Background Elements */}
                <div className="absolute top-20 -right-40 w-96 h-96 bg-zinc-900/10 rounded-full filter blur-[100px]"></div>
                <div className="absolute bottom-20 -left-40 w-96 h-96 bg-slate-900/10 rounded-full filter blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center pointer-events-none"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    viewport={{
                        amount: 'some',
                        margin: '-100px',
                        once: true,
                    }}
                    whileInView={'visible'}
                    className="container mx-auto px-4 relative z-10"
                >
                    <motion.div
                        variants={containerVariants}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.div
                            variants={childVariants}
                            className="inline-block mb-4 px-3 py-1 border border-zinc-500/50 bg-zinc-500/10 text-zinc-300 rounded-full text-sm font-medium"
                        >
                            <Sparkles className="inline-block mr-2 h-3.5 w-3.5 text-purple-400" />
                            Features
                        </motion.div>
                        <motion.h2
                            variants={childVariants}
                            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500"
                        >
                            Everything You Need to Create Perfect Forms
                        </motion.h2>
                        <motion.p
                            variants={childVariants}
                            className="text-zinc-300"
                        >
                            Design forms that convert with an intuitive builder,
                            intelligent logic, and seamless integrations.
                            Whether you’re starting with our templates or
                            building from scratch, FormCraft has you covered.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView={'visible'}
                        viewport={{
                            amount: 'some',
                            margin: '-200px',
                            once: true,
                        }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<Wand2 className="h-6 w-6 text-indigo-400" />}
                            title="AI Form Generator"
                            description="Generate forms from prompts and customize them to your needs with AI assistance."
                            gradient="from-zinc-900/80 to-indigo-950/20"
                            status="completed"
                            variants={childVariants}
                        />
                        <FeatureCard
                            variants={childVariants}
                            icon={
                                <Layers className="h-6 w-6 text-purple-400" />
                            }
                            title="Drag & Drop Builder"
                            description="Easily add, remove, and rearrange form fields with our intuitive drag-and-drop interface."
                            gradient="from-zinc-900/80 to-slate-950/20"
                            status="completed"
                        />
                        <FeatureCard
                            variants={childVariants}
                            icon={<Zap className="h-6 w-6 text-blue-400" />}
                            title="Conditional Logic"
                            description="Create dynamic forms that adjust in real time based on user inputs."
                            gradient="from-zinc-900/80 to-black/20"
                            status="completed"
                        />
                        <FeatureCard
                            variants={childVariants}
                            icon={
                                <CheckCircle2 className="h-6 w-6 text-green-400" />
                            }
                            title="Advanced Validation"
                            description="Built-in validation for common use cases and custom validation with regex support."
                            gradient="from-zinc-900/80 to-green-950/20"
                            status="completed"
                        />
                        <FeatureCard
                            variants={childVariants}
                            icon={
                                <Database className="h-6 w-6 text-amber-400" />
                            }
                            title="Seamless Integrations"
                            description="Connect with Google Sheets, Airtable, and webhooks to automate your workflows."
                            gradient="from-zinc-900/80 to-amber-950/20"
                            status="completed"
                        />
                        <FeatureCard
                            variants={childVariants}
                            icon={
                                <BarChart3 className="h-6 w-6 text-rose-400" />
                            }
                            title="Real-Time Analytics"
                            description="Track form views, submissions, completion rates, and other key metrics."
                            gradient="from-zinc-900/80 to-rose-950/20"
                            status="completed"
                        />
                    </motion.div>

                    <motion.div
                        className="mt-16 text-center"
                        variants={childVariants}
                    >
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                        >
                            <Link href={LINKS.signin}>
                                Explore All Features
                            </Link>
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Templates Section */}
            <section
                id="templates"
                className="py-24 bg-gradient-to-b from-zinc-900 to-black"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    viewport={{
                        amount: 'some',
                        margin: '-100px',
                        once: true,
                    }}
                    whileInView={'visible'}
                    className="container mx-auto px-4"
                >
                    <motion.div
                        variants={containerVariants}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.div
                            variants={childVariants}
                            className="inline-block mb-4 px-3 py-1 border border-zinc-500/50 bg-zinc-500/10 text-zinc-300 rounded-full text-sm font-medium"
                        >
                            Templates
                        </motion.div>
                        <motion.h2
                            variants={childVariants}
                            className="text-3xl md:text-4xl font-bold mb-6 text-white"
                        >
                            Start with Pre-built Templates
                        </motion.h2>
                        <motion.p
                            variants={childVariants}
                            className="text-zinc-300"
                        >
                            Choose from a diverse range of professionally
                            designed templates and customize them to fit your
                            unique needs.
                        </motion.p>
                    </motion.div>

                    <TemplateShowcase />
                </motion.div>
            </section>

  

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/20 to-zinc-900/20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(60,60,60,0.1),transparent_70%)]"></div>
                <div className="absolute top-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                <div className="absolute bottom-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    viewport={{
                        amount: 'some',
                        margin: '-100px',
                        once: true,
                    }}
                    whileInView={'visible'}
                    className="container mx-auto px-4 relative z-10"
                >
                    <motion.div
                        variants={childVariants}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <motion.h2 className="text-2xl md:text-5xl font-bold mb-6 text-white">
                            Ready to Transform Your Form Experience?
                        </motion.h2>
                        <motion.p className="text-base md:text-xl text-zinc-300 mb-10 leading-relaxed">
                            Create beautiful forms that convert better, save
                            time, and provide a seamless experience for your
                            users.
                        </motion.p>
                        
                        <PricingSection/>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-12 bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Product
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#features"
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#templates"
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Templates
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Resources
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href={`${LINKS.projectRepo}/issues`}
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`${LINKS.projectRepo}/issues`}
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        Contact Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Connect
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href={LINKS.linkedinProfile}
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={LINKS.githubProfile}
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <Image src="/logo.webp" alt="FormCraft" width={32} height={32} />
                                <span className="font-bold text-white">
                                    FormCraft
                                </span>
                            </div>
                            <span className="text-muted-foreground/60 text-sm">
                                Built by{' '}
                                <a
                                    href={LINKS.portfolio}
                                    target="_blank"
                                    className="underline"
                                >
                                    Avik Mukherjee
                                </a>
                                . The source code is available on{' '}
                                <a
                                    className="underline"
                                    href={LINKS.projectRepo}
                                    target="_blank"
                                >
                                    GitHub
                                </a>
                                .
                            </span>
                        </div>

                        <p className="text-zinc-500 text-sm">
                            © {new Date().getFullYear()} FormCraft. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default LandingPage;