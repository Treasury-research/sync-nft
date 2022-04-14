const mongoose = require('mongoose')
/**
 * NFT Schema
 */
const NFTSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    image_url: String,
    contracts: [Object],
    meta: Object,
    synced: {
        type: Number,
        default: 0
    }
},{
  timestamps: true
})

NFTSchema.method({
})

/**
 * Statics method
 */
 NFTSchema.statics = {
  // some methods
  
}
NFTSchema .index({ id: 1 }, { unique: true, dropDups: true });

module.exports = mongoose.model('NFT', NFTSchema)
