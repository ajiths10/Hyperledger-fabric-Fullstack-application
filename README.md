# hyperledger-fabric-Fullstack-application

## Clone test sample projects from the official team

[Clone link ](https://github.com/ajiths10/fabric-samples.git).

## Getting started with the Fabric samples

## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Create the test network and a channel (from the `test-network` folder).

   ```
   ./network.sh up createChannel -c mychannel -ca
   ```

1. Deploy one of the smart contract implementations (from the `test-network` folder).

   ```
   # To deploy the TypeScript chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript

   # To deploy the Go chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go/ -ccl go

   # To deploy the Java chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-java/ -ccl java
   ```

1. Run the application (from the `asset-transfer-basic` folder).

   ```
   # To run the Typescript sample application
   cd application-gateway-typescript
   npm install
   npm start

   # To run the Go sample application
   cd application-gateway-go
   go run .

   # To run the Java sample application
   cd application-gateway-java
   ./gradlew run
   ```

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```
./network.sh down
```
