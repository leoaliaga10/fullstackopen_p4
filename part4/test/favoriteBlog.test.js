const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { blogs } = require('../misc/blogs_for_test')

describe('favorite blog', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that blog with correct format', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    
    assert.deepStrictEqual(result, expected)
  })

  test('when list has multiple blogs, returns the one with most likes in correct format', () => {
    const result = listHelper.favoriteBlog(blogs)
    
    const expected = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    
    assert.deepStrictEqual(result, expected)
  })

})
