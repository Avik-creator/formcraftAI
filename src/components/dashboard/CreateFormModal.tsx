import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateFormMutation } from "@/data-fetching/client/form"
import { useBillingInfoQuery } from "@/data-fetching/client/billing"
import { useEnsureCanCreateForm } from "@/data-fetching/client/billing"
import { useFormActionProperty } from "@/zustand/store"
import { LayoutTemplate, PuzzleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { NewFeatureBadge } from "@/components/common/FeatureReleaseBadge"
import useFeatureAnnouncer from "@/hooks/useFeatureAnnouncer"
import BuildWithAI from "./BuildWithAI"
import { useEffect, useState } from "react"

interface CreateFormModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

const CreateFormModal = ({ open, setOpen, className }: CreateFormModalProps) => {
  const router = useRouter()
  const setFormConfig = useFormActionProperty("setFormConfig")
  const hasAnnouncedNewFormFeature = useFeatureAnnouncer("new-form-generation-capability")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mutate = useCreateFormMutation({
    onMutate: () => {
      setOpen(false)
      const toastId = toast.loading("Creating form...")
      return toastId as string
    },
    onSuccess: (data, context) => {
      toast.dismiss(context as string)
      if (data?.id) {
        setFormConfig(data)
        toast.success("Form created successfully!", {
          style: { background: "#000", color: "#fff" },
        })
        setTimeout(() => router.push("/builder"), 1000)
      }
    },
  })

  const { data: billingInfo } = useBillingInfoQuery()
  const { mutateAsync: ensureCanCreate } = useEnsureCanCreateForm()

  const atFormLimit = Boolean(
    !billingInfo?.isPro && (billingInfo?.usage?.formsCount ?? 0) >= (billingInfo?.limits?.maxForms ?? 0),
  )

  const handleWithTemplateOption = () => {
    setOpen(false)
    router.push("/dashboard/templates")
  }

  const handleBuildFromScratch = async () => {
    try {
      await ensureCanCreate()
    } catch {
      return
    }
    mutate(void null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <div className="flex gap-2 items-center">
          {mounted && !hasAnnouncedNewFormFeature && <NewFeatureBadge />}
          <Button variant="default" size={"sm"}>
            Create a new form
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-[95dvw] sm:max-w-[520px] p-6 backdrop-blur-md bg-black/95 border border-zinc-700/50 shadow-2xl ring-1 ring-white/5">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold text-white/95">Create a form</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {atFormLimit && (
            <div className="p-4 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-900/30 to-orange-900/20 text-amber-100 text-sm backdrop-blur-sm">
              <div className="font-medium mb-1">Plan Limit Reached</div>
              <div className="text-amber-200/80">
                You have reached the free plan limit of 3 forms. Upgrade to Pro for unlimited forms.
              </div>
            </div>
          )}
          <BuildWithAI />
          <Button
            className="w-full justify-start gap-3 h-12 bg-zinc-800/50 hover:bg-zinc-700/60 border border-zinc-600/30 text-white/90 hover:text-white transition-all duration-200 hover:border-zinc-500/50"
            onClick={handleBuildFromScratch}
            disabled={atFormLimit}
            variant="outline"
          >
            <PuzzleIcon className="w-4 h-4" /> Build from scratch
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-600/30 text-white/80 hover:text-white/95 transition-all duration-200 hover:border-zinc-500/50"
            onClick={handleWithTemplateOption}
            disabled={atFormLimit}
          >
            <LayoutTemplate className="w-4 h-4" /> Start with a template
          </Button>
          {atFormLimit && (
            <Button
              asChild
              className="w-full justify-center h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-zinc-800/50">
          <DialogClose asChild>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormModal
