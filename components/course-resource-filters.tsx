"use client"

import { Filter, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function CourseResourceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [resourceType, setResourceType] = useState(searchParams.get("type") || "all")
  const [semester, setSemester] = useState(searchParams.get("semester") || "all")

  const updateFilters = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value === "all") {
      params.delete(type)
    } else {
      params.set(type, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleResourceTypeChange = (value: string) => {
    setResourceType(value)
    updateFilters("type", value)
  }

  const handleSemesterChange = (value: string) => {
    setSemester(value)
    updateFilters("semester", value)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Course Resources</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={resourceType} onValueChange={handleResourceTypeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
                <SelectItem value="midterm">Midterms</SelectItem>
                <SelectItem value="final">Finals</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <Select value={semester} onValueChange={handleSemesterChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="Spring 2023">Spring 2023</SelectItem>
                <SelectItem value="Fall 2022">Fall 2022</SelectItem>
                <SelectItem value="Summer 2022">Summer 2022</SelectItem>
                <SelectItem value="Spring 2022">Spring 2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
