import express from 'express';
var router = express.Router();
var User = require('./model/user');
var Times = require('./model/times');

router.post('/entry', requireAuth, async (req, res) => {
  try {
    //get the time the activity was done for and get time the timer stoped
    const { value, timestamp } = req.body;
    
    //get our user
    const userId = req.session.userId;

    //make a new entry in the db
    const entry = await User.findByIdAndUpdate(userId, { $push: { times: { value: value, recordedAt: new Date() } } }, { new: true });

    return res.status(201).json({ success: true, entryId: entry._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

function requireAuth(req, res, next) {
  //only allow entrys to the DB if signed in
  if (!req.session || !req.session.userId) return res.status(401).json({ error: 'authentication required' });
  next();
}

module.exports = router;