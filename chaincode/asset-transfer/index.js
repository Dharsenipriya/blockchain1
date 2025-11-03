'use strict';
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {
  async CreateAsset(ctx, id, name, color, owner, value) {
    const asset = { ID: id, Name: name, Color: color, Owner: owner, Value: value };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return `Asset ${id} created.`;
  }

  async ReadAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    if (!assetJSON || assetJSON.length === 0) throw new Error(`Asset ${id} not found`);
    return assetJSON.toString();
  }

  async TransferAsset(ctx, id, newOwner) {
    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);
    asset.Owner = newOwner;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return `Asset ${id} now belongs to ${newOwner}.`;
  }
}

module.exports = AssetTransfer;
____________________________

Start Fabric test network

./network.sh up createChannel -ca
./network.sh deployCC -ccn asset-transfer -ccp ./chaincode/asset-transfer -ccl javascript


Enroll user and import identity into wallet

node enrollAdmin.js
node registerUser.js


Run the app

npm install fabric-network
node assetApp.js

