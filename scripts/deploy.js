
const hre = require("hardhat");

async function main() {

   const airdrop = await hre.ethers.getContractFactory("Airdrop");
   const airdropTx = await airdrop.deploy();

   await airdropTx.deployed();


  console.log(`
  Airdrop contract deployed to:
  ${airdropTx.address}
  `);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



