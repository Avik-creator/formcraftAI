import { getFormConfigWithIdAction } from '@/backend/actions/form';
import { FormConfig } from '@/types/index';
import React from 'react';
import Form from '@/components/form/Form';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const themeGradients = {
  'midnight-black': {
    backgroundGradient: 'from-black via-zinc-950 to-zinc-900',
    accentGlow1: 'bg-zinc-800/20',
    accentGlow2: 'bg-zinc-700/10',
    gridOpacity: '0.70',
  },
  'deep-space': {
    backgroundGradient: 'from-black via-[#090916] to-[#0b0b18]',
    accentGlow1: 'bg-blue-900/10',
    accentGlow2: 'bg-indigo-900/10',
    gridOpacity: '0.5',
  },
  'charcoal-black': {
    backgroundGradient: 'from-black via-[#0b0808] to-[#211717]',
    accentGlow1: 'bg-zinc-800/15',
    accentGlow2: 'bg-zinc-700/10',
    gridOpacity: '0.7',
  },
  'deep-violet': {
    backgroundGradient: 'from-black via-[#0a0214] to-[#1A0631]',
    accentGlow1: 'bg-purple-900/15',
    accentGlow2: 'bg-violet-900/10',
    gridOpacity: '0.4',
  },
  'night-sky': {
    backgroundGradient: 'from-[#050c23] via-[#02000a] to-[#131026]',
    accentGlow1: 'bg-indigo-900/15',
    accentGlow2: 'bg-blue-900/10',
    gridOpacity: '0.4',
  },
} as const;

const defaultGradient = {
  backgroundGradient: 'from-black to-zinc-950',
  accentGlow1: 'bg-zinc-800/10',
  accentGlow2: 'bg-zinc-700/10',
  gridOpacity: '0.9',
};

interface FormPageProps {
  params: Promise<{ formid: string }>;
}

const FormPage = async ({ params }: FormPageProps) => {
  try {
    // Await the params and extract formId
    const resolvedParams = await params;
    const { formid } = resolvedParams;
    
    // Validate that formId exists
    if (!formid) {
      console.error('No formId provided in params');
      notFound();
    }

    // do not log request parameters
    
    // Fetch form configuration with error handling
    const response = await getFormConfigWithIdAction(formid);
    
    if (!response?.data) {
      console.error('No form data found for formId:', formid);
      notFound();
    }

    const formConfig: FormConfig = response.data;
    // do not log form configuration

    // Get theme configuration
    const themeName = formConfig?.theme?.id || 'midnight-black';
    const gradientConfig = themeGradients[themeName as keyof typeof themeGradients] || defaultGradient;

    return (
      <main
        className={`w-full min-h-screen overflow-x-hidden relative bg-gradient-to-b ${gradientConfig.backgroundGradient} flex flex-col items-center justify-start px-4 sm:px-6 py-12 animate-fadeIn`}
      >
        {/* Accent glow effects with enhanced positioning and size */}
        <div
          className={`absolute top-0 -right-20 w-[600px] h-[600px] ${gradientConfig.accentGlow1} rounded-full filter blur-[120px] opacity-75 animate-pulse pointer-events-none z-0`}
          style={{ animationDuration: '10s' }}
        ></div>
        <div
          className={`absolute bottom-0 -left-20 w-[600px] h-[600px] ${gradientConfig.accentGlow2} rounded-full filter blur-[120px] opacity-75 animate-pulse pointer-events-none z-0`}
          style={{ animationDuration: '12s' }}
        ></div>

        {/* Enhanced glow for specific themes */}
        {(themeName === 'deep-violet' || themeName === 'night-sky') && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-full filter blur-[130px] animate-pulse pointer-events-none z-0"
            style={{ animationDuration: '15s' }}
          ></div>
        )}

        {/* Improved grid background with fade effect */}
        <div
          className="absolute z-0 inset-0 bg-[url('/grid.svg')] bg-center bg-repeat pointer-events-none animate-fadeIn"
          style={{ 
            opacity: gradientConfig.gridOpacity,
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        ></div>

        {/* Main content container with max width */}
        <div className="w-full max-w-3xl mx-auto relative z-10 rounded-2xl backdrop-blur-sm">
          {/* Main form component */}
          <div className="animate-slideUp">
            <Form formConfig={formConfig} />
          </div>

          {/* Enhanced footer branding */}
          <div className="mt-12 flex items-center justify-center gap-2 opacity-40 hover:opacity-90 transition-all duration-300 group relative z-10">
            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
              <Image 
                src="/logo.webp" 
                alt="FormCraft" 
                width={32} 
                height={32} 
                className="rounded-lg shadow-lg"
              />
            </div>
            <span className="text-sm font-medium text-zinc-100 tracking-wide">
              Powered by FormCraft
            </span>
          </div>
        </div>
      </main>
    );

  } catch (error) {
    console.error('Error in FormPage:', error);
    // You might want to show an error page or redirect
    notFound();
  }
};

export default FormPage;