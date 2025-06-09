const User = require('../models/user')
const Blog = require('../models/blogs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  },
  {
    username: 'testuser',
    name: 'Test User',
    password: 'password123'
  }
]

const nonExistingId = async () => {
  const user = new User({ username: 'willremovethissoon', name: 'temp', passwordHash: 'temp' })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

// Función para crear un usuario de prueba y obtener su token
const createUserAndGetToken = async (userData = {}) => {
  const { username = 'testuser', name = 'Test User', password = 'testpass123' } = userData
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = new User({
    username,
    name,
    passwordHash
  })
  
  const savedUser = await user.save()
  
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }
  
  const token = jwt.sign(userForToken, process.env.SECRET)
  
  return { user: savedUser, token }
}

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
  blogsInDb,
  createUserAndGetToken
} 

