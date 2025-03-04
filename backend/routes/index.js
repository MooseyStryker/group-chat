const express = require('express');
const router = express.Router();

const apiRouter = require('./api')

router.use('/api', apiRouter)


// This is our static routes
// Serves our React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/dist")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });
}


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
