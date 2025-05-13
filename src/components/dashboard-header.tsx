"use client"

import { useState } from "react"
import { Bell, Plus } from "lucide-react"
import Link from "next/link"
import NotificationPanel from "@/components/notification-panel"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/models/notification"

interface DashboardHeaderProps {
  notifications: Notification[]
}

export default function DashboardHeader({ notifications }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 z-10">
                  <NotificationPanel initialNotifications={notifications} />
                </div>
              )}
            </div>
            <Link href="/upload">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
