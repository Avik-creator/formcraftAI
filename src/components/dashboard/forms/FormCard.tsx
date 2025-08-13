"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Menu from "@/components/ui/kebabMenu"

import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { getAppOriginUrl } from "@/utils/functions"
import { ArrowRight, LoaderCircle } from "lucide-react"
import Link from "next/link"

interface FormCardProps {
  id: string
  title: string
  description: string
  status: string
  submissions: number
  lastModified: Date | string
  isPreview?: boolean
  onEdit?: (id: string, name: string) => void
  onDelete?: (id: string, name: string) => void
}

const FormCard = ({
  id,
  title,
  description,
  status,
  submissions,
  lastModified,
  isPreview,
  onEdit,
  onDelete,
}: FormCardProps) => {
  const formActions = [
    {
      label: "Edit",
      onClick: () => onEdit?.(id, title),
    },
    {
      label: "Delete",
      onClick: () => onDelete?.(id, title),
    },
  ]

  if (status === "published") {
    formActions.push({
      label: "Go to published form",
      onClick: () => {
        const formLink = `${getAppOriginUrl()}/form/${id}`
        window.open(formLink, "_blank")
      },
    })
  }

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden bg-zinc-900/90 border-2 border-zinc-700/60 shadow-2xl",
          "hover:-translate-y-1 hover:border-zinc-600/80 hover:bg-zinc-800/95 hover:shadow-zinc-900/50 hover:shadow-2xl transition-all duration-300",
          "ring-1 ring-zinc-800/50",
          {
            "cursor-pointer": !isPreview,
            "cursor-not-allowed animate-pulse": isPreview,
          },
        )}
      >
        <CardHeader className="space-y-3 pb-4">
          <CardTitle className="flex items-center justify-between w-full gap-4">
            <h2
              className="text-base md:text-lg max-w-[90%] bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-200 flex items-center group font-semibold"
              onClick={() => onEdit?.(id, title)}
            >
              <Link
                prefetch
                href={`/builder`}
                className="inline-flex items-center hover:from-zinc-100 hover:to-white transition-all"
              >
                {title || "Untitled Form"}
                <ArrowRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-zinc-300" />
              </Link>
            </h2>
            {!isPreview && <Menu items={formActions} />}
          </CardTitle>
          <CardDescription className="-mt-1 text-sm text-zinc-300/90 truncate leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <Link
            prefetch
            href={submissions > 0 ? `/dashboard/forms/${id}` : ""}
            className={cn(
              "inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200",
              "bg-zinc-800/60 border-zinc-600/50 hover:bg-zinc-700/70 hover:border-zinc-500/60",
              "font-semibold shadow-lg hover:shadow-xl",
              "ring-1 ring-zinc-700/30 hover:ring-zinc-600/40",
            )}
          >
            <span className="font-bold text-2xl text-white drop-shadow-sm">{submissions}</span>
            <span className="text-zinc-200 font-medium">submissions</span>
            {submissions > 0 && (
              <ArrowRight
                className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform text-zinc-300"
                aria-label="View Submissions"
              />
            )}
          </Link>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full gap-4 text-ellipsis pt-2 border-t border-zinc-800/50">
          <p
            className="text-zinc-400/90 text-xs font-medium"
            title={new Date(lastModified ?? Date.now()).toLocaleString()}
          >
            Last modified: {formatDistanceToNow(new Date(lastModified ?? Date.now()))}
          </p>
          <FormStatusTag status={isPreview ? "creating-new" : status} />
        </CardFooter>
      </Card>
    </>
  )
}

export default FormCard

const FormStatusTag = ({ status }: { status: string }) => {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-zinc-800/90 border-2 border-zinc-600/60 ring-1 ring-zinc-700/40",
    },
    published: {
      label: "Published",
      color: "bg-emerald-900/80 border-2 border-emerald-600/70 ring-1 ring-emerald-700/50",
    },
    "creating-new": {
      label: "Creating...",
      color: "bg-zinc-800/90 border-2 border-zinc-600/60 ring-1 ring-zinc-700/40",
    },
  }

  return (
    <div
      className={`flex items-center gap-1.5 h-7 px-3 rounded-full shadow-lg ${
        statusConfig[status as keyof typeof statusConfig]?.color
      }`}
    >
      <span className="text-white font-medium text-xs flex items-center gap-1.5">
        {statusConfig[status as keyof typeof statusConfig].label}
        {status === "creating-new" && <LoaderCircle className="w-3.5 h-3.5 inline animate-spin" />}
      </span>
    </div>
  )
}
