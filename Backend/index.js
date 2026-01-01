const http = require('http')
const { app } = require('./app')
const { Server } = require('socket.io')
const cron = require('node-cron')

const PORT = 5000
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

// In-memory storage
const blogs = []
const comments = {}

cron.schedule('*/1 * * * *', () => {
  const now = new Date()

  blogs.forEach((blog) => {
    if (
      blog.status === 'scheduled' &&
      blog.publishAt &&
      new Date(blog.publishAt) <= now
    ) {
      blog.status = 'published'
      blog.publishedAt = new Date()

      console.log(`✅ Auto-published: ${blog.title}`)

      // Send live update to clients
      io.emit('receive_blog', blog)
    }
  })
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.emit(
    'load_blogs',
    blogs.filter((b) => b.status === 'published')
  )

  // Create blog
  socket.on('new_blog', (data) => {
    const {
      title,
      description,
      image,
      category,
      publishAt,
    } = data

    if (!title || !description || !category) return

    const blog = {
      id: Date.now().toString(),
      title,
      description,
      image: image || null,
      category,
      status: publishAt ? 'scheduled' : 'published',
      publishAt: publishAt || null,
      createdAt: new Date(),
      publishedAt: publishAt ? null : new Date(),
    }

    blogs.push(blog)

    // Emit only if already published
    if (blog.status === 'published') {
      io.emit('receive_blog', blog)
    }
  })

  // Join blog room for comments
  socket.on('join_blog', (blogId) => {
    socket.join(blogId)
    socket.emit('load_comments', comments[blogId] || [])
  })

  // New comment
  socket.on('new_comment', ({ blogId, comment }) => {
    if (!comments[blogId]) comments[blogId] = []
    comments[blogId].push(comment)
    io.to(blogId).emit('receive_comment', comment)
  })

  socket.on('disconnect', () =>
    console.log('User disconnected:', socket.id)
  )
})

server.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
)
