const hre = require("hardhat");
const fs = require('fs')

async function main(){
    const Verification = await hre.ethers.getContractFactory("Verification");
    const verification = await Verification.deploy();
    await verification.deployed();
    console.log("Verification contract deployed to: ", verification.address);

    let config = `module.exports ={
        verificationaddress : "${verification.address}"
    }
    `
    let data = JSON.stringify(config)
    fs.writeFileSync('config.js', JSON.parse(data))
}

main()
    .then(() => process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });