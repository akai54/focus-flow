import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync.js'
import { ObjectId } from 'mongodb'

const authMiddleware = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Please login to access this route' })
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const usersCollection = req.db.collection('users')
  const currentUser = await usersCollection.findOne({
    _id: new ObjectId(decoded.id)
  })

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      error: 'The user belonging to this token does no longer exist.'
    })
  }

  req.user = { userId: currentUser._id.toString() }
  next()
})

export default authMiddleware
