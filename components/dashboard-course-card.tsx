"use client"

import { BookOpen, Star, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Course } from "@/models/course"
import { useState } from "react"
import { toggleFavoriteCourse, removeCourseFromUser } from "@/controllers/course-controller"
import { toast } from "@/components/ui/use-toast"

interface DashboardCourseCardProps {
  course: Course
  onRemove?: (courseId: string) => void
}

export default function DashboardCourseCard({ course, onRemove }: DashboardCourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleToggleFavorite = async () => {
    const result = await toggleFavoriteCourse(course.id)
    if (result.success) {
      setIsFavorite(result.isFavorite)
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
  }

  const handleRemoveCourse = async () => {
    setIsRemoving(true)
    const result = await removeCourseFromUser(course.id)
    setIsRemoving(false)

    if (result.success) {
      toast({
        title: result.message,
        variant: "default",
      })
      // Remove the course from the UI
      if (onRemove) {
        onRemove(course.id)
      }
    } else {
      toast({
        title: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative">
          <div className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleFavorite}>
                  <Star className="h-4 w-4 mr-2" />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemoveCourse} disabled={isRemoving}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isRemoving ? "Removing..." : "Remove from Dashboard"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={course.semester === "Spring 2023" ? "default" : "secondary"}>{course.semester}</Badge>
          {course.recentlyUpdated && (
            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
              Updated
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold mb-1">{course.code}</h3>
        <h4 className="text-lg font-medium mb-4">{course.title}</h4>
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{course.resourceCount} Resources</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
        <Link href={`/courses/${course.id}`} className="text-purple-600 font-medium text-sm hover:text-purple-800">
          View Resources →
        </Link>
        <Link href={`/upload?course=${course.id}`}>
          <Button size="sm" variant="ghost">
            Upload
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
