"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var User = require('./model/user');
var Times = require('./model/times');
router.post('/entry', requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the time the activity was done for and get time the timer stoped
        const { value, timestamp } = req.body;
        //get our user
        const userId = req.session.userId;
        //make a new entry in the db
        const entry = yield User.findByIdAndUpdate(userId, { $push: { times: { value: value, recordedAt: new Date() } } }, { new: true });
        return res.status(201).json({ success: true, entryId: entry._id });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
    }
}));
function requireAuth(req, res, next) {
    //only allow entrys to the DB if signed in
    if (!req.session || !req.session.userId)
        return res.status(401).json({ error: 'authentication required' });
    next();
}
module.exports = router;
//# sourceMappingURL=timeRouts.js.map