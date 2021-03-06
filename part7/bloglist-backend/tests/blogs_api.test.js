const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const noteObjects = helper.initialBlogs.map(note => new Blog(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned', async() => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('verify the unique identifier property of blog posts is called id', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('making a POST without a token fails', async () => {
  const newBlog = {
    title: 'How to make great examples',
    author: 'John Doe',
    url: 'http://example.org',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('making a POST request creates a blog post', async () => {
  const newBlog = {
    title: 'How to make great examples',
    author: 'John Doe',
    url: 'http://example.org',
    likes: 0
  }

  const token = await helper.getValidToken()
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

  const titles = response.body.map(blog => blog.title)
  expect(titles).toContain(newBlog.title)
})

test('POST without likes property defaults to 0 likes', async () => {
  const newBlog = {
    title: 'How to make great examples',
    author: 'John Doe',
    url: 'http://example.org',
  }

  const token = await helper.getValidToken()
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toEqual(0)
})

test('POST without title property is a bad request', async () => {
  const newBlog = {
    author: 'Bob Ross',
    url: 'https://br.example.com',
    likes: 42
  }

  const token = await helper.getValidToken()
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token.token}`)
    .send(newBlog)
    .expect(400)
})

test('POST without url property is a bad request', async () => {
  const newBlog = {
    title: 'The Joy of Painting',
    author: 'Bob Ross',
    likes: 42
  }

  const token = await helper.getValidToken()
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token.token}`)
    .send(newBlog)
    .expect(400)
})

test.skip('deleting a blog', async () => {
  const firstBlog = await Blog.find({title: 'React patterns'})
  const idToDelete = firstBlog[0]['_id']

  await api
    .delete(`/api/blogs/${idToDelete}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length - 1)
})

test('updating a blog', async () => {
  const firstBlog = await Blog.find({title: 'React patterns'})
  const idToDelete = firstBlog[0]['_id']
  const updatedBlog = {...firstBlog, title: 'React anti patterns'}

  await api
    .put(`/api/blogs/${idToDelete}`)
    .send(updatedBlog)
    .expect(200)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(response.body.map(blog => blog.title)).toContain(updatedBlog.title)
})

afterAll(() => {
  mongoose.connection.close()
})
