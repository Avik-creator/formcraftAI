import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const FormCardSkeleton = ({ delay = 0 }) => {
  return (
    <Card
      className="backdrop-blur-sm bg-black/40 border border-zinc-800/60 shadow-xl transition-all duration-300 dark:bg-black/40 dark:border-zinc-800/60"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="flex items-center justify-between w-full gap-4">
          <Skeleton className="h-5 w-[80%] bg-zinc-800/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-4 w-4 rounded-full bg-zinc-800/60 dark:bg-zinc-800/60" />
        </CardTitle>

        <CardDescription className="space-y-2">
          <Skeleton className="h-3 w-[90%] bg-zinc-800/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-3 w-[65%] bg-zinc-800/60 dark:bg-zinc-800/60" />
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-8 bg-zinc-800/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-3 w-20 bg-zinc-800/60 dark:bg-zinc-800/60" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between w-full gap-4 pt-4 border-t border-zinc-800/30">
        <Skeleton className="h-3 w-[100px] bg-zinc-800/60 dark:bg-zinc-800/60" />
        <Skeleton className="h-5 w-16 rounded-full bg-zinc-800/60 dark:bg-zinc-800/60" />
      </CardFooter>
    </Card>
  )
}

const FormLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 items-center">
        <Skeleton className="md:w-[500px] h-10 rounded-lg bg-zinc-800/60 dark:bg-zinc-800/60" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <FormCardSkeleton key={i} delay={i * 120} />
        ))}
      </div>
    </div>
  )
}

export default FormLoading
