import { ArrowLeft, Bell, Clock, MessageSquare, User, Shield, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export const NotificationPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [notificationList, setNotificationList] = useState([
    {
      id: 1,
      type: "game",
      title: "New Achievement Unlocked!",
      message: "You've reached a 10-day streak in Truth or False",
      time: "5 minutes ago",
      isRead: false,
      icon: Gamepad2,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: 2,
      type: "discussion",
      title: "New Reply on Your Discussion",
      message: "Sarah Chen replied to 'Understanding source credibility'",
      time: "1 hour ago",
      isRead: false,
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 3,
      type: "security",
      title: "Media Analysis Complete",
      message: "Your submitted content has been analyzed and results are ready",
      time: "2 hours ago",
      isRead: true,
      icon: Shield,
      color: "bg-green-100 text-green-700"
    },
    {
      id: 4,
      type: "social",
      title: "New Discussion in Forum",
      message: "Mike Rodriguez started a discussion about bias detection",
      time: "4 hours ago",
      isRead: true,
      icon: User,
      color: "bg-orange-100 text-orange-700"
    },
    {
      id: 5,
      type: "game",
      title: "Daily Challenge Available",
      message: "Complete today's media literacy challenge to earn points",
      time: "8 hours ago",
      isRead: true,
      icon: Gamepad2,
      color: "bg-purple-100 text-purple-700"
    }
  ]);

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-inter font-bold text-xl text-gray-900">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white rounded-full">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-3">
        {notificationList.map((notification) => (
          <Card 
            key={notification.id} 
            className={`bg-white shadow-sm rounded-2xl border transition-all hover:shadow-md ${
              !notification.isRead ? 'border-[#2D3A8C] bg-blue-50/30' : 'border-gray-200'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-full ${notification.color} flex-shrink-0`}>
                  <notification.icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-inter font-semibold text-sm text-gray-900 ${
                      !notification.isRead ? 'font-bold' : ''
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#2D3A8C] rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-2 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{notification.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State (if no notifications) */}
        {notificationList.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-inter font-semibold text-lg text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600">
              We'll notify you when something important happens
            </p>
          </div>
        )}

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full text-[#2D3A8C] border-[#2D3A8C] hover:bg-[#2D3A8C] hover:text-white"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};