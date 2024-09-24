const express = require('express')
const router = express.Router()
const jobsController = require('../controllers/jobs')

router.get('/', jobsController.getAllJobs)

router.post('/', jobsController.createJob)

router.get('/new', jobsController.newJobForm)

router.get('/edit/:id', jobsController.editJob)

router.post('/update/:id', jobsController.updateJob)

router.post('/delete/:id', jobsController.deleteJob)

module.exports = router