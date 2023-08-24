const express = require('express');
const router = express.Router();
const userRouter = require('../routes/user');
const experienceRouter = require('../routes/experience');
const portofolioRouter = require('../routes/portofolio');
const skillRouter = require('../routes/skill');

router.use('/user', userRouter);
router.use('/experience', experienceRouter);
router.use('/portofolio', portofolioRouter);
router.use('/skill', skillRouter);
module.exports = router;
