#!/bin/bash

### Before that, you need to create a file and grant execution permissions for it. (run `chmod -R a+rwx <path>`)
# Path to store the current version file
VERSION_FILE="/home/ajiths/Desktop/PersonalProjects/chaincodeVersioncontrol/MediLedger-chaincodes/patients-chaincode/current_version.txt"

# Function to increment version
increment_version() {
    local old_version=$1
    local major=$(echo $old_version | cut -d. -f1)
    local minor=$(echo $old_version | cut -d. -f2)
    local new_minor=$((minor + 1))
    echo "$major.$new_minor"
}

# Ensure the version file exists, create it if it doesn't
if [ ! -f "$VERSION_FILE" ]; then
    echo "1.0" > "$VERSION_FILE"
fi

# Read the current version from the file
current_version=$(cat "$VERSION_FILE")

# Check if a version argument is provided and valid
provided_version=$1
if [[ ! -z "$provided_version" ]]; then
    if [[ "$provided_version" > "$current_version" ]]; then
        new_version=$provided_version
    else
        echo "Provided version ($provided_version) must be greater than the current version ($current_version)."
        exit 1
    fi
else
    new_version=$(increment_version $current_version)
fi

# Save the new version to the file
echo $new_version > $VERSION_FILE

### specify your path
# Change directory to the path where network.sh is located
cd /home/ajiths/Desktop/PersonalProjects/blockchain/fabric-samples/test-network

### specify your path
# Execute the network.sh script with the new version
./network.sh deployCC -ccn patientsChaincode -ccp /home/ajiths/Desktop/PersonalProjects/hyperledger-fabric-Fullstack-application/MediLedger-chaincodes/patients-chaincode/ -ccl javascript -ccv $new_version -c patients

# Output the new version
echo "Deployed chaincode version: $new_version"
