const express = require('express');
const router = express.Router();
const experienceController = require('../controller/experience');
router
  .get('/', experienceController.getAllExperience)
  .get('/profile/:id', experienceController.getSelectExperienceUser)
  .post('/', experienceController.createExperience)
  .put('/:id', experienceController.updateExperience)
  .delete('/:id', experienceController.deleteExperience);
module.exports = router;
