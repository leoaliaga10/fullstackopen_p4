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

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})
  
  const mostLikesAuthor = Object.entries(authorLikes).reduce((max, [author, totalLikes]) => {
    return totalLikes > max.likes ? { author, likes: totalLikes } : max
  }, { author: '', likes: 0 })
  
  return {
    author: mostLikesAuthor.author,
    likes: mostLikesAuthor.likes
  }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }


