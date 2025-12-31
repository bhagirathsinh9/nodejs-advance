import React from 'react'
import Navbar from '../componets/shared/Navbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className='h-screen'>
      <div className='bg-gray-100 h-auto w-full'>
        <div className='p-3'>
          <Navbar />
        </div>

        <Outlet />
      </div>
    </div>
  )
}
