
import { LoadingSpinner } from "@/components/ui/loader"
import { Skeleton } from "@/components/ui/skeleton"

export default function Component() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
       <LoadingSpinner />
      </div>
    </div>
  )
}