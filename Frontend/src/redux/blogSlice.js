import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  blogs: [], // all blogs
  selectedBlog: null, // blog selected to view details
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload
    },
    addBlog: (state, action) => {
      state.blogs.push(action.payload)
    },
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload
    },
  },
})

export const { setBlogs, addBlog, setSelectedBlog } = blogSlice.actions
export default blogSlice.reducer
