import React from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addBlog } from '../redux/blogSlice'
import { io } from 'socket.io-client'

export default function AddBlog() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Connect to Socket.IO
  const socket = io('http://localhost:5000')

  const handleSubmit = (values, { resetForm }) => {
    const newBlog = {
      ...values,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    }

    // Send blog to server
    socket.emit('new_blog', newBlog)

    // Optional: Add locally to Redux
    dispatch(addBlog(newBlog))

    alert('Blog Added Successfully')
    navigate('/')

    resetForm()
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      image: '',
      description: '',
    },
    onSubmit: handleSubmit,
  })

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
        Add New Blog
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-5'>
        <div className='bg-gray-100 rounded-lg shadow flex items-center justify-center overflow-hidden'>
          {formik.values.image ? (
            <img
              src={formik.values.image}
              alt='Blog Preview'
              className='w-full h-full object-cover'
            />
          ) : (
            <p className='text-gray-400 text-center px-4'>
              Image preview will appear here
            </p>
          )}
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='bg-white shadow-lg rounded-lg p-6 space-y-5'
        >
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Blog Title
            </label>
            <input
              type='text'
              name='title'
              value={formik.values.title}
              onChange={formik.handleChange}
              className='mt-1 w-full border rounded-md px-3 py-2'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Category
            </label>
            <select
              name='category'
              value={formik.values.category}
              onChange={formik.handleChange}
              className='mt-1 w-full border rounded-md px-3 py-2'
              required
            >
              <option value=''>Select Category</option>
              <option value='Technology'>Technology</option>
              <option value='Politics'>Politics</option>
              <option value='Business'>Business</option>
              <option value='Lifestyle'>Lifestyle</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Image URL
            </label>
            <input
              type='text'
              name='image'
              value={formik.values.image}
              onChange={formik.handleChange}
              className='mt-1 w-full border rounded-md px-3 py-2'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Blog Content
            </label>
            <textarea
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
              rows='5'
              className='mt-1 w-full border rounded-md px-3 py-2'
              required
            />
          </div>

          <button
            type='submit'
            className='bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700'
          >
            Add Blog
          </button>
        </form>
      </div>
    </div>
  )
}
