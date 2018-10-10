'use strict';

const express = require('express');
const { initContext, responseHandler } = require('src/controllers/common.controller');
const campaignController = require('src/controllers/campaign.controller');

const campaignRouter = express.Router();

campaignRouter
  .route('/')
  .post(
    initContext,
    campaignController.createOne,
    responseHandler,
  )
  .get(
    initContext,
    campaignController.getMany,
    responseHandler,
  );

campaignRouter
  .route('/:id')
  .get(
    initContext,
    campaignController.getOneById,
    responseHandler,
  )
  .patch(
    initContext,
    campaignController.updateOneById,
    responseHandler,
  );

module.exports = campaignRouter;
