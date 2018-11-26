import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  username: {
    type: String,
    required: true,
    maxlength: 128
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
    select: false
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  const user = this
  if (!this.isModified('password')) return next()

  bcrypt.hash(this.password, 8, function (err, hash) {
    if (err) {
      next(err)
    } else {
      user.password = hash
      next()
    }
  })
})

userSchema.method({
  async comparePasswords (password) {
    return bcrypt.compare(password, this.password)
  },
  transform () {
    var obj = this.toObject()
    delete obj.password
    return obj
  }
})

userSchema.statics = {
  async get (id) {
    try {
      let user
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec()
      }

      if (user) return user

      return new Error('Could not find user.')
    } catch (error) {
      throw error
    }
  }
}

export default mongoose.model('User', userSchema)
