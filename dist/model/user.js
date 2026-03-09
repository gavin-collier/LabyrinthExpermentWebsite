var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const timeEntrySchema = new Schema({
    value: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now }
}, { _id: false });
const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    times: [timeEntrySchema]
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map