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

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }


