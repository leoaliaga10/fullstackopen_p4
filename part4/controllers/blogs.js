const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.use(middleware.tokenExtractor)

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  // Verificar que existe un token
  if (!request.token) {
    return response.status(401).json({ error: 'token required' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user Unauthorized' })
  }
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Populate para obtener la información completa del usuario
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // Verificar que existe un token
  if (!request.token) {
    return response.status(401).json({ error: 'token required' })
  }

  // Decodificar el token para obtener el usuario
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // Buscar el blog que se quiere eliminar
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Verificar que el usuario del token es el mismo que creó el blog
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(403).json({ error: 'permission denied: you can only delete your own blogs' })
  }

  // Eliminar el blog
  await Blog.findByIdAndDelete(request.params.id)
  
  // Remover la referencia del blog del array de blogs del usuario
  const user = request.user
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter
