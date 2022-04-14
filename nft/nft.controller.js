const NFT = require('./nft.model')
const aws = require('../aws')
const fs = require('fs');

async function save(nft) {
    try {
        let saved =  await NFT.findOne({id: nft.id})
        if (!saved) {
            saved = await NFT.create(nft)
        }
        return saved
    } catch (err){
        if (err.code===11000) {
            return true
        }
        throw err
    }
}

const processObject = async function(nftObject) {
    if (nftObject.image_url) {
        nftObject.image_url = await aws.CSPToS3(nftObject.image_url, `collection/${nftObject.id}/`)
    }
    for (let index = 0; index < nftObject.contracts.length; index++) {
        if(nftObject.contracts[index].image_url) {
            nftObject.contracts[index].image_url = await aws.CSPToS3(nftObject.contracts[index].image_url, `contract/${nftObject.contracts[index].address}/`)
        }
    }
    return nftObject
}

const outputJSON = async function () {
    const nfts = await NFT.find({synced: 1})
    let data = JSON.stringify(nfts);
    fs.writeFileSync('nfts.json', data);
    console.log("syncing nfts finished")
    process.exit(0)
}

async function updateS3Link() {
    try {
        const nft = await NFT.findOne({synced:0})
        if (nft) {
            const processed = await processObject(nft)
            processed.synced = 1
            return await NFT.updateOne({id: processed.id}, processed)
        } else {
            return undefined
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}
module.exports = { save, updateS3Link }
