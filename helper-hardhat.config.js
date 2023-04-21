const networkConfig = {
    default: {
        name: "hardhat"
    },
    31337: {
        name: "localhost",
        wethContract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
    },
    11155111: {
        name: "sepolia",
        wethContract: "https://sepolia.etherscan.io/address/0xdd13E55209Fd76AfE204dBda4007C227904f0a81",
        lendingPoolAddressesProvider: "0x0496275d34753A48320CA58103d5220d394FF77F"
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}