const User = require('../models/user')

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

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb
} 

