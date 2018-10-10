'use strict';

const express = require('express');
const campaignRouter = require('src/routes/campaign/campaign.route');

const router = express.Router();

router.use('/campaigns', campaignRouter);

module.exports = router;
