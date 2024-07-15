# Chaincode Deployment Script

This script automates the deployment of Hyperledger Fabric chaincode by incrementing the version number automatically or accepting a user-provided version. It ensures that the provided version is greater than the current version before deploying.

## Prerequisites

-   Ensure you have the necessary permissions to execute the script.
-   Ensure `network.sh` is located at `/home/ajiths/Desktop/PersonalProjects/blockchain/fabric-samples/test-network`.

## Version Control

The script maintains a version control file at `/home/ajiths/Desktop/PersonalProjects/chaincodeVersioncontrol/MediLedger-chaincodes/patients-chaincode/current_version.txt`. If the file does not exist, it is created with an initial version of `1.0`.

## Usage

### Automatic Version Increment

To deploy the chaincode with an automatically incremented version:

```
./deploy_chaincode.sh
```

## User-Provided Version

To deploy the chaincode with a user-provided version:

sh
Copy code

```
./deploy_chaincode.sh <version>
```

Replace <version> with the desired version number. The provided version must be greater than the current version.

## Example

Automatic Increment:

sh
Copy code

```
./deploy_chaincode.sh
```

This will increment the minor version number by 1 and deploy the chaincode.

User-Provided Version:

sh
Copy code

```
./deploy_chaincode.sh 2.1
```

This will deploy the chaincode with version 2.1 if 2.1 is greater than the current version.

## Script Details

The script checks if the current_version.txt file exists. If not, it creates the file and initializes it with version 1.0.
It reads the current version from the file.
If a user-provided version is supplied, it checks if the version is greater than the current version.
If no version is provided, it increments the current version.
It updates the current_version.txt file with the new version.
It changes the directory to /home/ajiths/Desktop/PersonalProjects/blockchain/fabric-samples/test-network and executes the network.sh script with the new version.

## Permissions

Ensure the script has execute permissions:

sh
Copy code

```
chmod +x deploy_chaincode.sh
```

For full access
sh
copy code

```
chmod -R a+rwx <path>
```

## Script

./deploy.sh
