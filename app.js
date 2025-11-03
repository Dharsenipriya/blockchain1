const express = require("express");
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

// Utility function to connect to the Fabric network
async function getContract() {
  const wallet = await Wallets.newFileSystemWallet("./wallet");
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork("mychannel");
  return network.getContract("fitness-rewards");
}

// Register or update reward points
app.post("/rewards", async (req, res) => {
  const { memberId, points } = req.body;
  try {
    const contract = await getContract();
    await contract.submitTransaction("addReward", memberId, points.toString());
    res.send({ message: "✅ Reward updated successfully." });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Query member reward history
app.get("/rewards/:id", async (req, res) => {
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction("queryReward", req.params.id);
    res.send(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => console.log("🏋️‍♀️ Fitness Rewards App running on port 3000"));
