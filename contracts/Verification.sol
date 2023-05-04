// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verification {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct File {
        uint ID;
        address sender;
        bool isVerified;
        string uri;
    }

    mapping(uint => File) public idToFiles;

    uint fileIds = 0;

    function addFile(string calldata _uri) public {
        File memory file;
        fileIds++;
        file.ID = fileIds;
        file.sender = msg.sender;
        file.uri = _uri;
        idToFiles[fileIds] = file;
    }

    function verifyFile(uint _id) public {
        require(idToFiles[_id].isVerified == false);
        require(owner == msg.sender);
        idToFiles[_id].isVerified = true;
    }

    function viewDocuments() public view returns (File[] memory) {
        uint filesCount = fileIds;
        uint currentIndex = 0;

        File[] memory fileArray = new File[](filesCount);
        for (uint i = 0; i < filesCount; i++) {
            uint currentId = idToFiles[i + 1].ID;
            File storage currentItem = idToFiles[currentId];
            fileArray[currentIndex] = currentItem;
            currentIndex++;
        }

        return fileArray;
    }
}