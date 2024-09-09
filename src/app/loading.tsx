import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white  rounded-lg shadow-md">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </div>
  )
}