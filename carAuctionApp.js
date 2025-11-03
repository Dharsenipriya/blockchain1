const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Load network connection profile (local or IBM Blockchain Starter Plan)
    const ccpPath = path.resolve(__dirname, 'connection-profile.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('car-auction');

    console.log('✅ Connected to Car Auction Network');

    // 1️⃣ Create a new car for auction
    await contract.submitTransaction('createCar', 'CAR100', 'Toyota', 'Camry', 'Blue', 'Alice');
    console.log('🚗 Car created: CAR100');

    // 2️⃣ Place a bid on the car
    await contract.submitTransaction('placeBid', 'CAR100', 'Bob', '25000');
    console.log('💰 Bid placed by Bob for $25,000');

    // 3️⃣ Query auction result
    const result = await contract.evaluateTransaction('queryCar', 'CAR100');
    console.log('🔍 Query Result:', result.toString());

    gateway.disconnect();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

main();
