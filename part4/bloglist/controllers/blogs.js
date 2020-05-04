const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result.toJSON())
  } catch (exception) {
    if (exception.name === 'ValidationError') {
      response.status(400).json({ error: 'Validation Error' })
    }
  }
})

module.exports = blogsRouter
