import React from 'react'
import { Outlet } from 'react-router-dom'
import MarparSidebar from './MarparSidebar'
import Header from './Header'

export default function MarparLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F0F0F0]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <MarparSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
            <Outlet />
        </div>
      </div>
    </div>
  )
}
