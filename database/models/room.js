const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {type: String},
    listUser: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'}
});

roomSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) :
            self.create(Object.assign(condition, {_id: mongoose.Types.ObjectId()}), (err, result) => {
                return callback(err, result)
            })
    })
};

module.exports = mongoose.model('Room', roomSchema);
