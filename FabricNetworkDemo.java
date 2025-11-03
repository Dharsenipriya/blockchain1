import org.hyperledger.fabric.gateway.*;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FabricNetworkDemo {
    public static void main(String[] args) throws Exception {

        // Path to the wallet and network connection profile
        Path walletPath = Paths.get("wallet");
        Path networkConfigPath = Paths.get("connection-org1.yaml");

        // Load existing identity (admin or appUser)
        Wallet wallet = Wallets.newFileSystemWallet(walletPath);
        if (!wallet.get("appUser").isPresent()) {
            System.err.println("❌ appUser identity not found in wallet.");
            return;
        }

        // Connect to gateway using Fabric SDK
        Gateway.Builder builder = Gateway.createBuilder()
                .identity(wallet, "appUser")
                .networkConfig(networkConfigPath)
                .discovery(true);

        try (Gateway gateway = builder.connect()) {
            // Get network channel and smart contract
            Network network = gateway.getNetwork("mychannel");
            Contract contract = network.getContract("fabcar");

            System.out.println("✅ Connected to Fabric network.");

            // Submit a transaction
            contract.submitTransaction("createCar", "CAR11", "Tesla", "Model3", "Red", "Alice");
            System.out.println("🚗 New asset created on blockchain.");

            // Query transaction
            byte[] result = contract.evaluateTransaction("queryCar", "CAR11");
            System.out.println("🔍 Query Result: " + new String(result));
        }
    }
}

-------------------------------
  curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0 1.5.0
cd fabric-samples/test-network
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -ccn fabcar -ccp ../fabcar/java -ccl java
  
Enroll appUser identity and place credentials in wallet/.

Place connection-org1.yaml (Fabric connection profile) in the project root.

Add dependency in pom.xml

  <dependency>
  <groupId>org.hyperledger.fabric-sdk-java</groupId>
  <artifactId>fabric-gateway-java</artifactId>
  <version>2.5.0</version>
</dependency>

  mvn clean install
java -cp target/*:. FabricNetworkDemo
