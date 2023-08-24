const express = require('express');
const router = express.Router();
const uploadUser = require('../middlewares/uploadUser');
const userController = require('../controller/user');
router
  .get('/profile/:id', userController.getselectUsers)
  .get('/profile', userController.getAllUser)
  .post('/register', userController.registerUser)
  .post('/registerRecruiter', userController.registerRecruiter)
  .post('/login', userController.loginUser)
  .put('/profile/:id', userController.updateUsers)
  .put('/profilephoto/:id', uploadUser, userController.updateImgUsers)
  .delete('/profile/:id', userController.deleteUsers);
module.exports = router;
