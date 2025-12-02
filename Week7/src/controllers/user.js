const express = require('express')
const { UserModel } = require('../models')
const { v4: uuidv4 } = require('uuid')

// var bodyParser = require('body-parser')
// const jsonParser = bodyParser.json()

const router = express.Router()

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now().toString())
    next()
})
// PATH: URL/users/
router.get('/', async function(req, res) {
    const rs = await UserModel.getAllUsers()
    console.log(rs)
    res.send(rs)
})
// users/:username
router.get('/:username', async function(req, res) {
    const { username } = req.params
    const rs = await UserModel.findUserByUsername(username)
    console.log(rs)
    res.send(rs)
})
router.post('/', async function(req, res) {
    const { username, name, gender } = req.body 
    try {
        // Check username uniqueness
        const existing = await UserModel.findUserByUsername(username)
        if (existing) {
            return res.status(409).send({ status: false, msg: 'This username is already taken. Please choose another.' })
        }
        const newUser = {
            id: uuidv4(),
            username,
            name,
            gender
        }
        await UserModel.insertUser(newUser)
        res.send({ status: true , data: newUser})
    }
    catch(error) {
        console.log(error)
        res.status(500).send({
            status: false,
            msg: 'We could not create this user. Please try again.',
            error: error?.message || error
        })
    }
})

router.post('/create', async function(req, res) {
    const { username, name, gender } = req.body 
    try {
        const existing = await UserModel.findUserByUsername(username)
        if (existing) {
            // Re-render index with error message (optional: could redirect with flash)
            const allUsers = await UserModel.getAllUsers()
            return res.status(409).render('index', { data: allUsers || [], createError: 'This username is already taken.' })
        }
        const newUser = { id: uuidv4(), username, name, gender }
        await UserModel.insertUser(newUser)
        res.redirect('/')
    }
    catch(error) {
        console.log(error)
        const allUsers = await UserModel.getAllUsers()
        res.status(500).render('index', { data: allUsers || [], createError: 'We could not add this user. Please try again.' })
    }
})
router.delete('/:userId', async function(req, res) {
    const { userId } = req.params 
    await UserModel.delUser(userId)
    res.send({ status: true })
})

router.put('/:userId', async function (req, res) {
    const { userId } = req.params
    try {
        if(!userId) return res.status(404).send({ status: false, msg: 'User information is missing. Please try again.' })
        const { username, name, gender } = req.body
        console.log(req.body)
        
        // Check if username is being changed to one that already exists
        const existing = await UserModel.findUserByUsername(username)
        if (existing && existing.id !== userId) {
            return res.status(409).send({ status: false, msg: 'This username is already taken by another user.' })
        }
        
        await UserModel.updateUser({
            username, name, gender
        }, userId)
        res.send({
            status: true,
            data: {
                username, name, gender
            }
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send({
            status: false, 
            msg: 'We could not update this user. Please try again.',
            error: err?.message || err
        })
    }
})
module.exports = router

