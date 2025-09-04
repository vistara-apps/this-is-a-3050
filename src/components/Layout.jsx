import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import NotificationSystem from './NotificationSystem'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <NotificationSystem />
    </div>
  )
}

export default Layout
