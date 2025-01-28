const express = require('express');
const router = express.Router();

router.get('/hello/world', function(req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send("I'm alive!!")
})

module.exports = router
