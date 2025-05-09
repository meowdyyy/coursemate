"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Course } from "@/models/course"
import { addCourseToUser } from "@/controllers/course-controller"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface AddCourseFormProps {
  availableCourses: Course[]
}

export default function AddCourseForm({ availableCourses }: AddCourseFormProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [addingCourseId, setAddingCourseId] = useState<string | null>(null)
  const router = useRouter()

  // Filter courses based on search query
  const filteredCourses = availableCourses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddCourse = async (courseId: string) => {
    setAddingCourseId(courseId)

    try {
      const result = await addCourseToUser(courseId)

      if (result.success) {
        toast({
          title: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding course:", error)
      toast({
        title: "Failed to add course",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingCourseId(null)
    }
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Courses to Your Dashboard</CardTitle>
          <CardDescription>Search for courses and add them to your dashboard to access study materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search for courses by name or code..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Courses</h3>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm"
                  >
                    <div>
                      <h4 className="font-medium">
                        {course.code}: {course.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {course.department} • {course.credits} Credits
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddCourse(course.id)}
                      disabled={addingCourseId === course.id}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {addingCourseId === course.id ? "Adding..." : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No courses found matching your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Link href="/dashboard">
            <Button>Done</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  )
}
