const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('asset-transfer');

    console.log('✅ Connected to Fabric network.');

    // 1️⃣ Create a new asset
    await contract.submitTransaction('CreateAsset', 'asset1', 'Laptop', 'Blue', 'Tom', '1000');
    console.log('🪙 Asset created: asset1');

    // 2️⃣ Transfer ownership
    await contract.submitTransaction('TransferAsset', 'asset1', 'Jerry');
    console.log('🔁 Ownership transferred to Jerry.');

    // 3️⃣ Query asset
    const result = await contract.evaluateTransaction('ReadAsset', 'asset1');
    console.log('🔍 Query Result:', result.toString());

    gateway.disconnect();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

main();
