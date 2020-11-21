
const express = require('express');

const router = express.Router();
const logger = require('../../../utils/logger');


const VoterService = require('./votersService');
const voterService = new VoterService();

router.get('/search_by_id',
    async (req, res) => {
        try {
            const result = await voterService.findByid(req.query);
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/search_by_box',
    async (req, res) => {
        try {
            const result = await voterService.findByBox(req.query);
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/voters_report',
    async (req, res) => {
        try {
            const result = await voterService.votersReport(req.query);
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'voters: votersController, function: /voters_report, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/circles_report',
    async (req, res) => {
        try {
            const result = await voterService.circlesReport(req.query);
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'voters: votersController, function: /circles_report, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/get_calphis_numbers',
    async (req, res) => {
        try {
            const result = await voterService.calphisNumbers();
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/get_circles',
    async (req, res) => {
        try {
            const result = await voterService.circles();
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.get('/voters_list',
    async (req, res) => {
        try {
            const result = await voterService.list(req.query);
            res.send(result);
        }
        catch (error) {
            const loggerMessage = 'User: userController, function: /sign-up, message: ' + error.message;
            logger.error(loggerMessage);
            res.status(400).send({ error: error.message });
        }
    });

router.post('/update_vote', async (req, res) => {
    try {
        const result = await voterService.updateVoter(req.body);
        res.send(result);
    }
    catch (error) {
        const loggerMessage = 'User: userController, function: delete /:email, message: ' + error.message;
        logger.error(loggerMessage);
        res.status(400).send({ error: error.message });
    }
});

router.post('/get_phone', async (req, res) => {
    try {
        const result = await voterService.updateContactMade(req.body);
        res.send(result);
    }
    catch (error) {
        const loggerMessage = 'User: userController, function: delete /:email, message: ' + error.message;
        logger.error(loggerMessage);
        res.status(400).send({ error: error.message });
    }
});

router.post('/add_voter', async (req, res) => {
    try {
        const result = await voterService.addVoter(req.body);
        res.send(result);
    }
    catch (error) {
        const loggerMessage = 'User: userController, function: delete /:email, message: ' + error.message;
        logger.error(loggerMessage);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
