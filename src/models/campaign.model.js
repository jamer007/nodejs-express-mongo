'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const CampaignSchema = new Schema({
  offeror: { type: String },
  title: { type: String },
  impressionTarget: { type: Number },
  cpm: { type: Number },
  schedule: {
    start: { type: Date },
    end: { type: Date },
  },
  assets: [{
    id: { type: String },
    passengerMaxImpression: { type: Number },
    backToBack: { type: Boolean },
    interaction: { type: String },
    clickLink: { type: String },
  }],
  airports: [{
    id: { type: String },
    code: { type: String, match: /[A-Z]/ },
    name: { type: String },
    city: { type: String },
  }],
});

// Compile model from schema
const Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;
