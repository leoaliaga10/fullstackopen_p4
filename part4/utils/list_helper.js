const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    //blogs es array de objetos
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  module.exports = {
    dummy,
    totalLikes
  }


