import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // confirmPassword: {
  //   type: String,
  //   required: true
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  coverPhoto: {
    type: String,
    default: '' 
  },
  bio: {
    type: String,
  },
  friends: {
    type:[String],
    default: []
  },
  followers: {
    type:[String],
    default: []
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'male', 'female', 'Frog'],
    required: true
  }
},
{
  timestamps: true
}
);

const User = mongoose.model('User',userSchema)
export default User