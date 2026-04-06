import React from 'react'
import { Outlet } from 'react-router-dom'
import DlpSidebar from './DlpSidebar'
import Header from './Header'

export default function DlpLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DlpSidebar />
        <div className="flex-1 min-w-0 flex flex-col overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
