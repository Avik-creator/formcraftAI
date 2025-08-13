"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { FormTemplate } from "@/types/index"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface TemplateCardProps {
  template: FormTemplate
  onPreview?: (template: FormTemplate) => void
}

const TemplateCard = ({ template, onPreview }: TemplateCardProps) => {
  const { meta } = template

  // Generate a deterministic gradient background based on template id
  const getTemplateBackground = () => {
    const id = template.id || template._id || ""
    const num = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5

    const gradients = [
      "from-zinc-700 to-zinc-800", // enhanced default
      "from-zinc-700 to-purple-900/40",
      "from-zinc-700 to-blue-900/40",
      "from-zinc-700 to-green-900/40",
      "from-zinc-700 to-amber-900/40",
    ]

    return gradients[num] || gradients[0]
  }

  return (
    <Card
      className={cn(
        "backdrop-blur-md bg-zinc-900/60 border-2 border-zinc-700/80 shadow-2xl ring-1 ring-zinc-600/20",
        "hover:-translate-y-1 hover:border-zinc-600/60 hover:shadow-3xl hover:ring-zinc-500/30 transition-all duration-300 group",
        "overflow-hidden",
      )}
    >
      <div
        className={`h-48 bg-gradient-to-br ${getTemplateBackground()} p-4 relative overflow-hidden transition-transform group-hover:scale-105 duration-500`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1.5 text-xs font-medium bg-zinc-800/90 text-zinc-200 rounded-md backdrop-blur-sm border border-zinc-600/30 shadow-lg">
            {"Template"}
          </span>
        </div>
      </div>

      <CardHeader className="space-y-0.5">
        <CardTitle className="flex items-center justify-between w-full gap-4" onClick={() => onPreview?.(template)}>
          <h2 className="text-base md:text-lg max-w-[90%] bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-200 flex items-center group transition-all duration-300 cursor-pointer">
            {meta.name}
            <ArrowRight className="w-4 h-4 inline ml-2 group-hover:opacity-100 opacity-60 text-zinc-300 transition-opacity duration-300" />
          </h2>
        </CardTitle>

        <CardDescription className="-mt-1 text-xs text-zinc-300">
          {meta.description?.slice(0, 100)}
          {meta.description && meta.description.length > 100 ? "..." : ""}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between items-center">
        <Button
          onClick={() => onPreview?.(template)}
          variant="ghost"
          size="sm"
          className="w-full justify-between bg-zinc-800/70 text-zinc-200 hover:bg-zinc-700/80 hover:text-white border border-zinc-600/40 hover:border-zinc-500/60 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Use template <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TemplateCard
