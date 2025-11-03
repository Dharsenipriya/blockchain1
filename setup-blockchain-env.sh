#!/bin/bash
set -e

echo "=== Updating system ==="
sudo apt-get update -y && sudo apt-get upgrade -y

echo "=== Installing Docker ==="
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker

echo "=== Installing Node.js (v18 LTS) ==="
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v

echo "=== Installing Hyperledger Fabric binaries ==="
mkdir -p ~/fabric && cd ~/fabric
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0 1.5.0
echo "Hyperledger Fabric binaries installed under ~/fabric."

echo "=== Installing Ethereum tools (Geth + Hardhat) ==="
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update -y
sudo apt-get install -y ethereum
npm install -g hardhat

echo "=== Installation Complete ==="
echo "Docker, Node.js, Hyperledger Fabric, and Ethereum tools are ready."
