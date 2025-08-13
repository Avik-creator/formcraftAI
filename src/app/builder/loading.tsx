import { Skeleton } from "@/components/ui/skeleton"

const BuilderLoading = () => {
  return (
    <main className="flex md:flex-row flex-col flex-nowrap bg-black w-[100dvw] h-[100dvh]">
      {/* Left Panel */}
      <div className="h-full bg-black/40 backdrop-blur-sm border-r border-zinc-800/60 flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow">
        <div className="pt-4">
          <Skeleton className="h-8 w-full bg-zinc-800/60" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="p-4 space-y-10 bg-black/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg" key={index}>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3 bg-zinc-800/60" />
              <Skeleton className="h-4 w-2/3 bg-zinc-800/60" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-zinc-800/60" />
              <Skeleton className="h-10 w-full bg-zinc-800/60" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-zinc-800/60" />
              <Skeleton className="h-10 w-full bg-zinc-800/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Center Panel */}
      <div className="h-full bg-black/30 backdrop-blur-sm border-r border-zinc-800/60 flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow-[2] z-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex flex-col gap-4 max-w-[80%] mx-auto mb-[100px]" key={index}>
            <div className="bg-black/40 backdrop-blur-sm border border-zinc-800/60 rounded-lg p-6 space-y-4">
              <Skeleton className="h-8 w-2/3 bg-zinc-800/60" />
              <Skeleton className="h-[300px] w-full bg-zinc-800/60 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="h-full bg-black/40 backdrop-blur-sm flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow">
        <div className="pt-4">
          <Skeleton className="h-8 w-full max-w-[95%] mx-auto bg-zinc-800/60" />
        </div>

        <div className="mt-[40px] flex flex-col gap-3 bg-black/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg p-4">
          <Skeleton className="h-5 w-1/3 bg-zinc-800/60" />
          <Skeleton className="h-4 w-2/3 bg-zinc-800/60" />
        </div>

        <div className="flex flex-col gap-[40px] mt-[40px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="bg-black/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg p-4" key={index}>
              <Skeleton className="h-[70px] w-full bg-zinc-800/60" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default BuilderLoading
