import { configureStore } from '@reduxjs/toolkit'
import blogSlice from './blogSlice.js'

export const store = configureStore({
  reducer: {
    blog: blogSlice,
  },
})
