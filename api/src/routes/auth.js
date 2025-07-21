import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync.js'

const router = Router()

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME || '90d'
  })
}

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'Lax',
    path: '/'
  })

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    data: {
      user
    }
  })
}

router.post(
  '/register',
  catchAsync(async (req, res) => {
    const { email, password, firstName, lastName, dateOfBirth, country } =
      req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password are required' })
    }

    const usersCollection = req.db.collection('users')
    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      country: country || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await usersCollection.insertOne(newUser)
    newUser._id = result.insertedId

    createSendToken(newUser, 201, req, res)
  })
)

router.post(
  '/login',
  catchAsync(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password are required' })
    }

    const user = await req.db.collection('users').findOne({ email })
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid credentials' })
    }

    createSendToken(user, 200, req, res)
  })
)

router.get('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/',
    sameSite: 'Lax'
  })
  res.status(200).json({ status: 'success' })
})

// Get current user profile
router.get(
  '/profile',
  catchAsync(async (req, res) => {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, error: 'Not authenticated' })
    }

    const { ObjectId } = await import('mongodb')
    const userId = new ObjectId(req.user.userId)

    const user = await req.db.collection('users').findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password from results
    )

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    res.status(200).json({ success: true, data: user })
  })
)

// Update user profile
router.put(
  '/profile',
  catchAsync(async (req, res) => {
    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ success: false, error: 'Not authenticated' })
    }

    const { ObjectId } = await import('mongodb')
    const userId = new ObjectId(req.user.userId)

    const { firstName, lastName, dateOfBirth, country } = req.body

    const updateData = {
      $set: {
        updatedAt: new Date()
      }
    }

    if (firstName !== undefined) updateData.$set.firstName = firstName
    if (lastName !== undefined) updateData.$set.lastName = lastName
    if (dateOfBirth !== undefined)
      updateData.$set.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    if (country !== undefined) updateData.$set.country = country

    const result = await req.db
      .collection('users')
      .findOneAndUpdate({ _id: userId }, updateData, {
        returnDocument: 'after',
        projection: { password: 0 }
      })

    if (!result) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    res.status(200).json({ success: true, data: result })
  })
)

export default router
