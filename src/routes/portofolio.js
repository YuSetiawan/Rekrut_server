const express = require('express');
const router = express.Router();
const uploadPortofolio = require('../middlewares/uploadPortofolio');
const portofolioController = require('../controller/portofolio');
router
  .get('/', portofolioController.getAllPortofolio)
  .get('/profile/:id', portofolioController.getSelectPortofolioUser)
  .post('/', uploadPortofolio, portofolioController.createPortofolio)
  .put('/:id', uploadPortofolio, portofolioController.updatePortofolio)
  .delete('/:id', portofolioController.deletePortofolio);
module.exports = router;
