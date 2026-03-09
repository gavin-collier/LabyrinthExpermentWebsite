import express from 'express';
var router = express.Router();
var User = require('./model/user');

router.post('/signin', async (req, res) => {
    try {
        //get the entered names
        var { firstname, lastname } = req.body || {};

        //make them uniform, and remove any problimatic characters
        let fn = normalizeName(firstname);
        let ln = normalizeName(lastname);

        //try and fine the user in the database
        const user = await User.findOne({ firstname: fn, lastname: ln }).collation({ locale: 'en', strength: 2 });

        //if the user doesn't exist in the database, don't sign in and return an error
        if (!user) return res.status(404).json({ error: 'user not found' });

        //make a session for the user
        req.session.userId = String(user._id);
        req.session.firstname = user.firstname;
        req.session.lastname = user.lastname;
        return res.json({ user: { id: user._id, firstname: user.firstname, lastname: user.lastname } });   
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
    }

});

router.post('/checkSession', async (req, res) => {
    if (req.session && req.session.userId) return res.json({ authenticated: true, user: { id: req.session.userId, firstname: req.session.firstname }});
    return res.json({ authenticated: false });
});

router.post('/signout', (req, res) => {
    //end the session
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'could not sign out' });
        res.clearCookie('sid');
        return res.json({ success: true });
    });
});



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

module.exports = router;