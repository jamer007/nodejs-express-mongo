'use strict';

const Campaign = require('src/models/campaign.model');

module.exports = {
  getMany,
  createOne,
  getOneById,
  updateOneById,
};

async function getMany(options) {
  let limit = null;
  let skip = null;

  if (options.paginate && options.paginate.limit) {
    ({ limit } = options.paginate);

    if (options.paginate.page && options.paginate.page > 1) {
      skip = limit * options.paginate.page;
    }
  }

  return Campaign
    .find(options.filter)
    .limit(limit)
    .skip(skip)
    .exec();
}

async function getOneById(id) {
  return Campaign.findById(id).exec();
}

async function updateOneById(id, campaign) {
  return Campaign
    .findByIdAndUpdate(id, campaign, { new: true, runValidators: true })
    .exec();
}

async function createOne(reqCampaign) {
  const newCampaignObj = new Campaign(reqCampaign);
  return newCampaignObj.save();
}
