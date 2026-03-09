var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const timesSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true },
});
module.exports = mongoose.model('Times', timesSchema);
//# sourceMappingURL=times.js.map