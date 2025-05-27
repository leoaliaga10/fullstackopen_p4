const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    //blogs es array de objetos
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
const favorite = blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  })
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})
  
  const mostBlogsAuthor = Object.entries(authorCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author, blogs: count } : max
  }, { author: '', blogs: 0 })
  
  return {
    author: mostBlogsAuthor.author,
    blogs: mostBlogsAuthor.blogs
  }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }


