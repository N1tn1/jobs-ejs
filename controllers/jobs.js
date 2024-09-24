const express = require('express')
const router = require('Router')
const Job = require('../models/Job')
const parseValidationErrors = require('../util/parseValidationErrs')
const User = require('./models/User')


const Job = require('../models/Job')
const parseValidationErrors = require('../util/parseValidationErrs')

exports.addJobForm = (req, res) => {
    res.render('job', { job: null })
}

exports.createJob = async (req, res) => {
    const { company, position, status } = req.body

    try {
        const newJob = new Job({
            company,
            position,
            status,
            createdBy: req.user._id
        })

        await newJob.save()
        req.flash('success', 'Job created successfully!')
        res.redirect('/jobs')
    } catch (err) {
        parseValidationErrors(err, req)
        res.render('job', { job: null })
    }
}

exports.editJobForm = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id })

        if (!job) {
            req.flash('error', 'Job not found')
            return res.redirect('/jobs')
        }

        res.render('job', { job })
    } catch (err) {
        req.flash('error', 'An error occurred while trying to edit the job.')
        res.redirect('/jobs')
    }
}

exports.updateJob = async (req, res) => {
    const { company, position, status } = req.body

    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            { company, position, status },
            { new: true, runValidators: true }
        )

        if (!job) {
            req.flash('error', 'Job not found')
            return res.redirect('/jobs')
        }

        req.flash('success', 'Job updated successfully!')
        res.redirect('/jobs')
    } catch (err) {
        parseValidationErrors(err, req)
        res.render('job', { job: { ...req.body, id: req.params.id } })
    }
}

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })

        if (!job) {
            req.flash('error', 'Job not found')
            return res.redirect('/jobs')
        }

        req.flash('success', 'Job deleted successfully!')
        res.redirect('/jobs')
    } catch (err) {
        req.flash('error', 'An error occurred while trying to delete the job.')
        res.redirect('/jobs')
    }
}