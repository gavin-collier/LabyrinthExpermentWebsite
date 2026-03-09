import express from 'express';
require('dotenv').config();
var router = express.Router();
var User = require('./model/user');
var Times = require('./model/times');

const ADMIN_API_KEY = process.env.ADMIN_PASSWORD;

function requireAdmin(req, res, next) {
    const key = req.header('X-Admin-Key');
    if (!key) return res.status(401).json({ error: 'admin auth required' });
    if (key !== ADMIN_API_KEY) {
        return res.status(401).json({ error: 'invalid admin auth' });        
    } 
    next();
}

function normalizeName(name = '') {
    name = String(name);
    name = name.trim().replace(/\s+/g, ' ');
    name = name.toLowerCase();
    return escapeRegex(name);
}

function escapeRegex(text) {
    //no droping our databases
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.post('/create', requireAdmin, async (req, res) => {
    try {
        //get first and lastname from user
        let { firstname, lastname } = req.body;
        let fn = normalizeName(firstname);
        let ln = normalizeName(lastname);

        //makesure we got both
        if (!fn || !ln) return res.status(400).json({ error: 'firstname and lastname required' });

        //make sure user doesn't allready exist 
        let user = await User.findOne({ firstname: fn, lastname: ln }).collation({ locale: 'en', strength: 2 });
        if (user) return res.status(409).json({ error: 'user already exists', userId: user._id });

        try {
            //make the user
            user = await User.create({ firstname: fn, lastname: ln });
            console.log("Made New User: " + fn);
        } catch (err) {
            user = await User.findOne({ firstname: fn, lastname: ln }).collation({ locale: 'en', strength: 2 });
            if (!user) throw err;
        }

        return res.status(201).json({ success: true, user: { id: user._id, firstname: user.firstname, lastname: user.lastname } }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
    }
});



module.exports = router;