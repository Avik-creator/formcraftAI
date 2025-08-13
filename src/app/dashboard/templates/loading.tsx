import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const TemplateCardSkeleton = ({ delay = 0 }) => {
  return (
    <Card
      className="backdrop-blur-sm bg-black/40 border border-zinc-800/60 shadow-xl transition-all duration-300 dark:bg-black/40 dark:border-zinc-800/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card Header Skeleton */}
      <CardHeader className="space-y-3 px-4 py-4">
        <div className="relative w-full h-[200px] overflow-hidden bg-zinc-900/30 rounded-lg border border-zinc-800/30">
          <Skeleton className="w-full h-full bg-zinc-800/60 dark:bg-zinc-800/60" />
        </div>

        <CardTitle>
          <Skeleton className="h-5 w-[85%] bg-zinc-800/60 dark:bg-zinc-800/60" />
        </CardTitle>

        <CardDescription className="space-y-2">
          <Skeleton className="h-3 w-[90%] bg-zinc-800/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-3 w-[60%] bg-zinc-800/60 dark:bg-zinc-800/60" />
        </CardDescription>
      </CardHeader>

      {/* Card Footer Skeleton */}
      <CardFooter className="flex items-center flex-wrap w-full px-4 py-3 gap-2">
        <Skeleton className="h-5 w-16 rounded-full bg-zinc-800/60 dark:bg-zinc-800/60" />
        <Skeleton className="h-5 w-20 rounded-full bg-zinc-800/60 dark:bg-zinc-800/60" />
        <Skeleton className="h-5 w-12 rounded-full bg-zinc-800/60 dark:bg-zinc-800/60" />
      </CardFooter>
    </Card>
  )
}

const TemplateLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 items-center">
        <Skeleton className="md:w-[500px] h-10 rounded-lg bg-zinc-800/60 dark:bg-zinc-800/60" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <TemplateCardSkeleton key={i} delay={i * 100} />
        ))}
      </div>
    </div>
  )
}

export default TemplateLoading
