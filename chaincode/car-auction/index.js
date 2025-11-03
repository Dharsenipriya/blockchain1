'use strict';
const { Contract } = require('fabric-contract-api');

class CarAuction extends Contract {
  async createCar(ctx, id, make, model, color, owner) {
    const car = { ID: id, Make: make, Model: model, Color: color, Owner: owner, HighestBid: 0, Bidder: '' };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
    return `Car ${id} listed for auction.`;
  }

  async placeBid(ctx, id, bidder, amount) {
    const carJSON = await ctx.stub.getState(id);
    if (!carJSON || carJSON.length === 0) throw new Error(`Car ${id} not found`);
    const car = JSON.parse(carJSON.toString());
    if (parseInt(amount) > car.HighestBid) {
      car.HighestBid = parseInt(amount);
      car.Bidder = bidder;
      await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
      return `New highest bid of ${amount} by ${bidder}`;
    } else {
      return `Bid too low. Current highest: ${car.HighestBid}`;
    }
  }

  async queryCar(ctx, id) {
    const carJSON = await ctx.stub.getState(id);
    if (!carJSON || carJSON.length === 0) throw new Error(`Car ${id} not found`);
    return carJSON.toString();
  }
}

module.exports = CarAuction;
-------------------------------------
  Start the Fabric network (local)

./network.sh up createChannel
./network.sh deployCC -ccn car-auction -ccp ./chaincode/car-auction -ccl javascript


Enroll user and import identity

node enrollAdmin.js
node registerUser.js


Run the app

npm install fabric-network
node carAuctionApp.js

Connect to IBM Blockchain Starter Plan

When you move from local Fabric to IBM’s managed network:

Replace connection-profile.json with the IBM Blockchain Platform connection profile downloaded from your service.

Replace the wallet with IBM-provided credentials and certificates.

No code changes needed — just use:

const ccpPath = path.resolve(__dirname, 'ibm-connection.json');
