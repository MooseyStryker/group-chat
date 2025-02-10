const express = require('express');
const router = express.Router();

const apiRouter = require('./api')

router.use('/api', apiRouter)


router.get('/hello/world', function(req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    res.send("I'm alive!!")
})

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    })
})

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
    router.get("/api/csrf/restore", (req, res) => {
      const csrfToken = req.csrfToken();
      res.cookie("XSRF-TOKEN", csrfToken);
      res.status(200).json({
        'XSRF-Token': csrfToken
      });
    });
  }

module.exports = router
