"use client"

import { useState } from "react"
import type { Course } from "@/models/course"
import DashboardCourseCard from "@/components/dashboard-course-card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardCourseListProps {
  initialCourses: Course[]
  filterType?: "all" | "current" | "archived" | "favorites"
}

export default function DashboardCourseList({ initialCourses, filterType = "all" }: DashboardCourseListProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  
  const displayedCourses = courses.filter((course) => {
    if (filterType === "all") return true
    if (filterType === "current") return course.semester === "Spring 2023"
    if (filterType === "archived") return course.semester !== "Spring 2023"
    if (filterType === "favorites") return course.isFavorite
    return true
  })

  const handleCourseRemoved = (courseId: string) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId))
  }

  return (
    <>
      {displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => (
            <DashboardCourseCard
              key={course.id}
              course={course}
              onRemove={handleCourseRemoved}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {filterType === "all"
              ? "Your dashboard is empty"
              : filterType === "favorites"
                ? "No favorite courses yet"
                : filterType === "current"
                  ? "No current semester courses"
                  : "No archived courses"}
          </h3>
          <p className="text-gray-500 mb-6">
            {filterType === "all"
              ? "Add courses to your dashboard to keep track of your study materials"
              : filterType === "favorites"
                ? "Mark courses as favorites to see them here"
                : filterType === "current"
                  ? "Add courses from the current semester to see them here"
                  : "Courses from past semesters will appear here"}
          </p>
          <Link href="/courses">
            <Button className="mr-4">
              <Plus className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </Link>
          <Link href="/courses/add">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
