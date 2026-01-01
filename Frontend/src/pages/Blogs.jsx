import React, { useEffect, useRef } from 'react'
import BlogCard from '../componets/BlogCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { addBlog, deleteBlog, setBlogs } from '../redux/blogSlice'

export default function Blogs() {
  const { blogs } = useSelector((store) => store.blog)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io('http://localhost:5000')

    // initial blogs
    socketRef.current.on('load_blogs', (data) => {
      dispatch(setBlogs(data))
    })

    // real-time new blog
    socketRef.current.on('receive_blog', (blog) => {
      dispatch(addBlog(blog))
    })

    socketRef.current.on('blog_deleted', (blogId) => {
  dispatch(deleteBlog(blogId))
})


    return () => {
      socketRef.current.disconnect()
    }
  }, [dispatch])

  return (
    <div>
      <div className='flex justify-end p-5 m-5'>
        <div className='mr-20'>
          <button
            className='bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700'
            onClick={() => navigate('/add-blog')}
          >
            Add Blog
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {blogs.map((blog, i) => (
          <BlogCard key={i} blog={blog} />
        ))}
      </div>
    </div>
  )
}
