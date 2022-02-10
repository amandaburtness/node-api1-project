// BUILD YOUR SERVER HERE
const e = require('express')
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.post('/api/users', (req, res) => {
  const newUser = req.body

  if (!newUser.name || !newUser.bio) {
    res.status(400).json({ message: "Please provide name and bio for the user" })
  } else {
    User.insert(newUser.name, newUser.bio)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(e => {
        res.status(500),json({ message: "There was an error while saving the user to the database" })
      })
  }
})

server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(e => {
      res.status(500).json({ message: "The users information could not be retrieved" })
    })
})

server.get('/api/users/:id', (req, res) => {
  const {id} = req.params

  User.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
        res.status(200).json(user)
      }
    })
    .catch(e => {
      res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

server.delete('/api/users/:id', async (req, res) => {
  try {
    const {id} = req.params
    const deletedUser = await User.remove(id)

    if (!deletedUser) {
      res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
      res.status(201).json(deletedUser)
    }
  } catch(e) {
    res.status(500).json({ message: "The user could not be removed" })
  }
})

server.put('/api/users/:id', (req, res) => {
  const {id} = req.params
  const changes = req.body

  try {

    if(!changes.name || !changes.bio) {
      res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
      const updatedUser = User.update(id, changes)

      if(!updatedUser) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
        res.status(200).json(updatedUser)
      }
    }

  } catch(e) {
    res.status(500).json({ message: "The user information could not be modified" })
  }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
