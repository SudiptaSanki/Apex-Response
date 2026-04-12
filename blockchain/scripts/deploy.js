const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Badge = await hre.ethers.getContractFactory("AegisStayBadge");
  const badge = await Badge.deploy();
  await badge.deployed();

  console.log("🏆 AegisStay Badge Contract deployed to:", badge.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
