const { ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat.config")
const { getWeth, AMOUNT } = require("./getWeth")




exports.main = async ()=>{
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId;
    const wethTokenAddress = networkConfig[chainId]["wethContract"]

    // Aave protocol treats everything as erc20 token
    // 1. That's why we got WETH erc20 Token from ETH
    await getWeth()

    // 2. Depositing WETH to aave contract as collateral
    const lendingPool = await getLendingPool(deployer, chainId)
    
    // 2.1 Approving aave lendingPool to get WETH from out account
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    
    console.log("Depositing----------------")
    const tx = await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited........................")

}

async function getLendingPool(signerAccount, chainId){
    // To deposit we need to call a function on lendingPool contract of aave
    // But to get that contract address we need to call a func on lendingPoolAdresses Contract

    const lendingPoolAddressesProvidersAddress = networkConfig[chainId]["lendingPoolAddressesProvider"]
    const lendingPoolAddressesProvider = await ethers.getContractAt ("ILendingPoolAddressesProvider", lendingPoolAddressesProvidersAddress, signerAccount)
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, signerAccount)
    return lendingPool
}

async function approveErc20(contractAddress, spenderAddress, amountToSpend, signerAccount){
    const erc20Token = await ethers.getContractAt("IWeth", contractAddress, signerAccount)
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved")
}

