const NFT = require('./nft.model')
const aws = require('../aws')
const fs = require('fs');

async function saveAll(nfts) {
    try {
        const saved = await NFT.create(nfts)
        console.log(`saved: ${saved.length} entries`)
        return saved
    } catch (err){
        if (err.code===11000) {
            for (let index = 0; index < nfts.length; index++) {
                await saveOne(nfts[index])
            }
            return true
        } else {
            console.log(err)
            throw err
        }
    }
}

async function saveOne(nft) {
    try {
        let saved =  await NFT.findOne({id: nft.id})
        if (!saved) {
            saved = await NFT.create(nft)
        }
        console.log(`saved: ${saved.id}`)
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

async function updateS3Link() {
    try {
        const nft = await NFT.findOne({synced:0, image_url : { $regex: /http/, $options: 'i' }})
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
module.exports = { saveOne, saveAll, updateS3Link }
