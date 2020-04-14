export interface Message {
  _id: string,
  roomId: string,
  message: string,
  from: string,
  // to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  createdAt: string
}
