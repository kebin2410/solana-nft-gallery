const fs = require('fs');
const idl = require('./src/contract/custom_solana_nft.json');

fs.writeFileSync('./src/contract/idl.json', JSON.stringify(idl));