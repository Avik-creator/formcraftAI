import { List, FileText, CheckCircle, FolderX, AlertCircle } from "lucide-react"
import { getAllActivitiesFromLastWeekAction } from "@/backend/actions/activity"
import InfoCard from "./InfoCard"
import type { ActivityModelType } from "@/backend/models/activity"
import { formatDistanceToNow } from "date-fns"

const activityTypeMap = {
  submission: {
    icon: FileText,
    color: "text-green-500",
    message: (activity: ActivityModelType) => (
      <>
        New submission on <b>{activity.formName}</b>
      </>
    ),
  },
  published: {
    icon: CheckCircle,
    color: "text-green-500",
    message: (activity: ActivityModelType) => (
      <>
        Form <b>{activity.formName}</b> is marked as <b>Published</b>
      </>
    ),
  },
  integration_error: {
    icon: AlertCircle,
    color: "text-red-500",
    message: (activity: ActivityModelType) => (
      <>
        <div className="flex items-center flex-wrap">
          <span className="font-bold capitalize mr-1">{activity?.details?.provider} </span> integration failed for{" "}
          <b className="ml-1">{activity?.formName}</b>
        </div>
      </>
    ),
  },
}

const RecentActivity = async () => {
  const res = await getAllActivitiesFromLastWeekAction()
  const activities = (res?.data ?? []) as ActivityModelType[]

  const renderActivity = (activity: ActivityModelType) => {
    const formattedTime = formatDistanceToNow(new Date(activity.createdAt), {
      addSuffix: true,
    })
    const { icon: Icon, color, message } = activityTypeMap[activity?.type as keyof typeof activityTypeMap] || {}

    if (!Icon) return null

    return (
      <div
        key={activity.createdAt.toString()}
        className="flex items-center gap-3 p-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/70 rounded-lg shadow-sm hover:shadow-lg transition-all hover:border-zinc-700/80 hover:bg-zinc-900/80"
      >
        <div className={`p-2.5 bg-zinc-800/90 rounded-full ${color} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-medium text-zinc-100 leading-relaxed">{message(activity)}</p>
          <p className="text-xs text-zinc-400 mt-1">{formattedTime}</p>
          {activity?.details?.message && (
            <small className="text-xs text-red-400 mt-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
              {activity.details.message}
            </small>
          )}
        </div>
      </div>
    )
  }

  return (
    <InfoCard
      className="col-span-full md:[grid-column:7/14] md:max-h-[400px] overflow-hidden border border-zinc-700/70"
      title="Recent Activities"
      icon={List}
      contentClassName="overflow-y-auto max-h-[80%] pr-2"
      description="A quick overview of recent submissions, form updates, and integration statuses."
      renderData={() =>
        activities.length > 0 ? (
          <div className="flex flex-col gap-4">{activities.map(renderActivity)}</div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <FolderX className="w-12 h-12 text-zinc-500 mb-3" />
            <p className="text-sm font-medium">No activities in the past week</p>
            <p className="text-xs text-zinc-500 mt-1">Activity will appear here as forms are used</p>
          </div>
        )
      }
    />
  )
}

export default RecentActivity
