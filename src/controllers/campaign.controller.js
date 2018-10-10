'use strict';

const campaignService = require('src/services/campaign.service');

module.exports = {
  getMany,
  createOne,
  getOneById,
  updateOneById,
};

async function getMany(req, res, next) {
  try {
    const options = req.mquery;
    req.context.result = await campaignService.getMany(options);
    next();
  } catch (err) {
    console.log(err);
    next(new Error('CAMPAIGNS_FETCHING_ERROR'));
  }
}

async function getOneById(req, res, next) {
  try {
    req.context.result = await campaignService.getOneById(req.params.id);
    next();
  } catch (err) {
    console.log(err);
    next(new Error('CAMPAIGN_FETCHING_ERROR'));
  }
}

async function createOne(req, res, next) {
  try {
    req.context.result = await campaignService.createOne(req.body);
    next();
  } catch (err) {
    console.log(err);
    next(new Error('CAMPAIGN_SAVING_ERROR'));
  }
}

async function updateOneById(req, res, next) {
  try {
    const campaign = req.body;
    req.context.result = await campaignService.updateOneById(
      req.params.id,
      campaign,
    );
    next();
  } catch (err) {
    console.log(err);
    next(new Error('CAMPAIGN_UPDATE_ERROR'));
  }
}
