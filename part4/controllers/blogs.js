const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

//blogsRouter.use(middleware.tokenExtractor)

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  //const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log("Token: ",request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //const user = await User.findById(body.userId)
  
  if (!user) {
    return response.status(400).json({ error: 'invalid user id' })
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

module.exports = blogsRouter
