const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { blogs } = require('../misc/blogs_for_test')

describe('most likes', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author with their likes', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      }
    ]
    
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    
    assert.deepStrictEqual(result, expected)
  })

  test('when list has multiple blogs, returns author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    
    assert.deepStrictEqual(result, expected)
  })
}) 