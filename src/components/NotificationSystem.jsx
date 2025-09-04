/**
 * Notification System Component
 * Displays toast notifications for user feedback
 */

import React from 'react'
import { useApp } from '../contexts/AppContext'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const NotificationSystem = () => {
  const { notifications, removeNotification } = useApp()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationStyles = (type) => {
    const baseStyles = "flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 bg-white"
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500`
      case 'error':
        return `${baseStyles} border-red-500`
      case 'warning':
        return `${baseStyles} border-orange-500`
      case 'info':
      default:
        return `${baseStyles} border-blue-500`
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} animate-slide-in`}
        >
          <div className="flex-shrink-0 mr-3">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {notification.message}
            </p>
            {notification.details && (
              <p className="text-xs text-gray-600 mt-1">
                {notification.details}
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
