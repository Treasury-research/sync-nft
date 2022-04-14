require("dotenv").config();
const aws = require('./aws')
const axios = require("axios")
const puppet = require('./puppet')
const NFT = require('./nft/nft.model')
const NFTController = require('./nft/nft.controller')
const fs = require('fs');

const getCollection = async function (next_Token) {
    let url
    if (next_Token && next_Token != 'start') {
        url = 'https://ubiquity.api.blockdaemon.com/v1/nft/ethereum/mainnet/collections?page_token=' + next_Token
    } else {
        url = 'https://ubiquity.api.blockdaemon.com/v1/nft/ethereum/mainnet/collections'
    }
    return axios.get(url, {
    headers: {
        'Authorization': `${process.env.TOKEN}`
    }
    })
    .then((res) => {return res.data})
    .catch((error) => {
        console.error(error)
    })
}


const outputJSON = async function () {
    const nfts = await NFT.find({synced: 1})
    let data = JSON.stringify(nfts);
    fs.writeFileSync('nfts.json', data);
    console.log("syncing nfts finished")
    process.exit(0)
}

const syncNftsDB = async function (next_Token='start') {
    try {
        const data = await getCollection(next_Token)
        const nfts =data.data
        for (let index = 0; index < nfts.length; index++) {
            const saved = await NFTController.save(nfts[index])
            console.log("saved: "+ saved.id)
        }
        if(data.meta && data.meta.paging && data.meta.paging.next_page_token) {
            console.log("new next_token: "+ data.meta.paging.next_page_token)
            next_Token = data.meta.paging.next_page_token
            await syncNftsDB(next_Token)
        } else {
            console.log("syncNftsDB finished")
            process.exit(0)
        }
    } catch(error) {
        console.error(error)
        throw error
    }
}

const updateNFTlinks = async function () {
    const nft = await NFTController.updateS3Link()
    if (nft) {
        updateNFTlinks()
    } else {
        outputJSON()
    }
}

module.exports = {
    syncNftsDB,
    updateNFTlinks
}