const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// middleware for maintenance
// app.use((req, res, next) => {
//     res.status(503).send('under maintenance');
// });

const upload = multer({
    dest: 'images'
});

app.post('/uploads', upload.single('upload'), (req, res) => {
    res.send();
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('sever running on port ' + port);
});