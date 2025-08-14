import { getFormConfigWithIdAction } from "@/backend/actions/form"
import type { FormConfig } from "@/types/index"
import Form from "@/components/form/Form"
import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"

const themeGradients = {
  "midnight-black": {
    backgroundGradient: "from-black via-zinc-950 to-zinc-900",
    accentGlow1: "bg-zinc-800/20",
    accentGlow2: "bg-zinc-700/10",
    gridOpacity: "0.70",
  },
  "deep-space": {
    backgroundGradient: "from-black via-[#090916] to-[#0b0b18]",
    accentGlow1: "bg-blue-900/10",
    accentGlow2: "bg-indigo-900/10",
    gridOpacity: "0.5",
  },
  "charcoal-black": {
    backgroundGradient: "from-black via-[#0b0808] to-[#211717]",
    accentGlow1: "bg-zinc-800/15",
    accentGlow2: "bg-zinc-700/10",
    gridOpacity: "0.7",
  },
  "deep-violet": {
    backgroundGradient: "from-black via-[#0a0214] to-[#1A0631]",
    accentGlow1: "bg-purple-900/15",
    accentGlow2: "bg-violet-900/10",
    gridOpacity: "0.4",
  },
  "night-sky": {
    backgroundGradient: "from-[#050c23] via-[#02000a] to-[#131026]",
    accentGlow1: "bg-indigo-900/15",
    accentGlow2: "bg-blue-900/10",
    gridOpacity: "0.4",
  },
} as const

const defaultGradient = {
  backgroundGradient: "from-black to-zinc-950",
  accentGlow1: "bg-zinc-800/10",
  accentGlow2: "bg-zinc-700/10",
  gridOpacity: "0.9",
}

interface FormPageProps {
  params: Promise<{ formid: string }>
}

export async function generateMetadata({ params }: FormPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const { formid } = resolvedParams

    if (!formid) {
      return {
        title: "Form Not Found",
        description: "The requested form could not be found.",
      }
    }

    const response = await getFormConfigWithIdAction(formid)

    if (!response?.data) {
      return {
        title: "Form Not Found",
        description: "The requested form could not be found.",
      }
    }

    const formConfig: FormConfig = response.data

    // Generate metadata from form configuration
    const title = formConfig.name || "Untitled Form"
    const description = formConfig.description || "Fill out this form to get started."
    const image = formConfig.image || "/form-preview.png" // fallback image

    return {
      title: `${title} | FormCraft`,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "website",
        siteName: "FormCraft",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      robots: {
        index: formConfig.status === "published",
        follow: formConfig.status === "published",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Form | FormCraft",
      description: "Fill out this form to get started.",
    }
  }
}

const FormPage = async ({ params }: FormPageProps) => {
  try {
    // Await the params and extract formId
    const resolvedParams = await params
    const { formid } = resolvedParams

    // Validate that formId exists
    if (!formid) {
      console.error("No formId provided in params")
      notFound()
    }

    // do not log request parameters

    // Fetch form configuration with error handling
    const response = await getFormConfigWithIdAction(formid)

    if (!response?.data) {
      console.error("No form data found for formId:", formid)
      notFound()
    }

    const formConfig: FormConfig = response.data
    // do not log form configuration

    // Get theme configuration
    const themeName = formConfig?.theme?.id || "midnight-black"
    const gradientConfig = themeGradients[themeName as keyof typeof themeGradients] || defaultGradient

    return (
      <main
        className={`w-full min-h-screen overflow-x-hidden relative bg-gradient-to-b ${gradientConfig.backgroundGradient} flex flex-col items-center justify-start px-4 sm:px-6 py-12 animate-fadeIn`}
      >
        {/* Accent glow effects with enhanced positioning and size */}
        <div
          className={`absolute top-0 -right-20 w-[600px] h-[600px] ${gradientConfig.accentGlow1} rounded-full filter blur-[120px] opacity-75 animate-pulse pointer-events-none z-0`}
          style={{ animationDuration: "10s" }}
        ></div>
        <div
          className={`absolute bottom-0 -left-20 w-[600px] h-[600px] ${gradientConfig.accentGlow2} rounded-full filter blur-[120px] opacity-75 animate-pulse pointer-events-none z-0`}
          style={{ animationDuration: "12s" }}
        ></div>

        {/* Enhanced glow for specific themes */}
        {(themeName === "deep-violet" || themeName === "night-sky") && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-full filter blur-[130px] animate-pulse pointer-events-none z-0"
            style={{ animationDuration: "15s" }}
          ></div>
        )}

        {/* Improved grid background with fade effect */}
        <div
          className="absolute z-0 inset-0 bg-[url('/grid.svg')] bg-center bg-repeat pointer-events-none animate-fadeIn"
          style={{
            opacity: gradientConfig.gridOpacity,
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        ></div>

        <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          {/* Main form component with additional width constraints */}
          <div className="w-full max-w-3xl animate-slideUp">
            <Form formConfig={formConfig} />
          </div>

          {/* Enhanced footer branding */}
          <div className="mt-12 flex items-center justify-center gap-2 opacity-40 hover:opacity-90 transition-all duration-300 group relative z-10">
            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
              <Image src="/logo.webp" alt="FormCraft" width={32} height={32} className="rounded-lg shadow-lg" />
            </div>
            <span className="text-sm font-medium text-zinc-100 tracking-wide">Powered by FormCraft</span>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in FormPage:", error)
    // You might want to show an error page or redirect
    notFound()
  }
}

export default FormPage
