import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setSelectedBlog } from '../redux/blogSlice'
import { useDispatch } from 'react-redux'
import socket from '../socket'

export default function BlogCard({ blog }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleReadMore = () => {
    dispatch(setSelectedBlog(blog))
    navigate(`/blog/${blog.id}`)
  }
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      socket.emit('delete_blog', blog.id)
    }
  }
  return (
    <div className='bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden'>
      <div
        className='h-48 bg-cover bg-center'
        style={{ backgroundImage: `url(${blog.image})` }}
      />

      <div className='p-4'>
        <span className='text-xs text-indigo-600 uppercase font-medium'>
          {blog.category}
        </span>

        <h3 className='text-lg font-bold text-gray-900 mt-2 line-clamp-2'>
          {blog.title}
        </h3>

        <p className='text-gray-600 text-sm mt-2 line-clamp-3'>
          {blog.description}
        </p>

        <div className='flex items-center justify-between mt-4'>
          <span className='text-xs text-gray-500'>{blog.date || 'Today'}</span>

          <button
            className='text-indigo-600 text-sm font-semibold hover:underline'
            onClick={handleReadMore}
          >
            Read More →
          </button>
          <button
        onClick={handleDelete}
        className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
      >
        Delete
      </button>
        </div>
      </div>
    </div>
  )
}
