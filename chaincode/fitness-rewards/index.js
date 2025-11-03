'use strict';

const { Contract } = require('fabric-contract-api');

class FitnessRewards extends Contract {
  async addReward(ctx, memberId, points) {
    const existing = await ctx.stub.getState(memberId);
    let total = existing && existing.length ? parseInt(existing.toString()) : 0;
    total += parseInt(points);
    await ctx.stub.putState(memberId, Buffer.from(total.toString()));
    return `Member ${memberId} now has ${total} points.`;
  }

  async queryReward(ctx, memberId) {
    const data = await ctx.stub.getState(memberId);
    if (!data || !data.length) throw new Error(`No rewards for ${memberId}`);
    return { memberId, points: parseInt(data.toString()) };
  }
}

module.exports = FitnessRewards;
-------------------------------------
  Run the Fabric test network and deploy this chaincode:

./network.sh up createChannel
./network.sh deployCC -ccn fitness-rewards -ccp ./chaincode/fitness-rewards -ccl javascript


Enroll user and create wallet (like in the Fabric samples).

Run web app:

npm install express fabric-network
node app.js
