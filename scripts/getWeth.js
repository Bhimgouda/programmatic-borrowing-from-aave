const { getNamedAccounts } = require("hardhat")
const { networkConfig } = require("../helper-hardhat.config")
const {network, ethers} = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.02")

const getWeth = async()=>{
    const {deployer} = await getNamedAccounts()
    
    // Getting the weth token giver contract address
    const chainId = network.config.chainId;
    wethTokenAddress = networkConfig[chainId]["wethContract"]

    // Calling deposit function with some value that we want to deposit and get WETH in return
    const iWeth = await ethers.getContractAt("IWeth", wethTokenAddress, deployer)
    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = {AMOUNT, getWeth}