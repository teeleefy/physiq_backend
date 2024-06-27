// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const app = express();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// app.post('/upload', upload.single('image'), (req, res) => {
//     const imagePath = req.file.path;

//     // Save imagePath to PostgreSQL
//     // INSERT INTO images (user_id, path) VALUES ($1, $2)

//     res.send('File uploaded successfully');
// });

// app.listen(3000, () => {
//     console.log('Server started on http://localhost:3000');
// });
