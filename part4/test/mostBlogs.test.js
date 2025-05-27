const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { blogs } = require('../misc/blogs_for_test')

describe('most blogs', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      }
    ]
    
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    
    assert.deepStrictEqual(result, expected)
  })

  test('when list has multiple blogs, returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    
    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    }
    
    assert.deepStrictEqual(result, expected)
  })

  
}) 