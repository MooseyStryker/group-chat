const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/csrf/restore:
 *   get:
 *     summary: Restore CSRF token
 *     tags: [CSRF]
 *     responses:
 *       200:
 *         description: CSRF token restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 XSRF-Token:
 *                   type: string
 *                   example: "a1b2c3d4e5f6g7h8i9j0"
 *                   description: The CSRF token
 */
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


const apiRouter = require('./api')

router.use('/api', apiRouter)

module.exports = router
