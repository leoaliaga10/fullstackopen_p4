const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('Blogs API', () => {
  let userToken, testUser

  beforeEach(async () => {
    // Limpiar base de datos
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    // Crear usuario de prueba y obtener token
    const userAndToken = await helper.createUserAndGetToken({
      username: 'testuser',
      name: 'Test User',
      password: 'testpass123'
    })
    
    testUser = userAndToken.user
    userToken = userAndToken.token

    // Crear algunos blogs de prueba
    const blogs = [
      {
        title: 'Test Blog 1',
        author: 'Test Author 1',
        url: 'http://testblog1.com',
        likes: 5,
        user: testUser._id
      },
      {
        title: 'Test Blog 2',
        author: 'Test Author 2',
        url: 'http://testblog2.com',
        likes: 10,
        user: testUser._id
      }
    ]

    const blogObjects = blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    const savedBlogs = await Promise.all(promiseArray)
    
    // Actualizar el usuario con las referencias a los blogs
    testUser.blogs = savedBlogs.map(blog => blog._id)
    await testUser.save()
  })

  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, 2)
    })

    test('blog posts have id property instead of _id', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body
      
      blogs.forEach(blog => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added with authentication', async () => {
      const newBlog = {
        title: 'New Test Blog',
        author: 'New Test Author',
        url: 'http://newtestblog.com',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, 3)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes('New Test Blog'))
    })

    test('fails with status 401 if no token is provided', async () => {
      const newBlog = {
        title: 'Blog without token',
        author: 'Author',
        url: 'http://example.com',
        likes: 1
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('token'))
    })

    test('likes defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Test Author',
        url: 'http://testblog.com'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status 204 if id and token are valid and user owns the blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status 401 if no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status 403 if user tries to delete blog that is not theirs', async () => {
      // Crear otro usuario
      const anotherUserAndToken = await helper.createUserAndGetToken({
        username: 'anotheruser',
        name: 'Another User',
        password: 'anotherpass123'
      })

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0] // Este blog pertenece al primer usuario

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${anotherUserAndToken.token}`)
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status 404 if blog does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
}) 