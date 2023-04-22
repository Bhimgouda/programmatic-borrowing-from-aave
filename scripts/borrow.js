const { getNamedAccounts } = require("hardhat");
const { networkConfig } = require("../helper-hardhat.config");

exports.borrow = async(lendingPool)=>{
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId;
    const daiTokenAddress = networkConfig[chainId].daiToken

    const {availableBorrowsETH, totalDebtETH} =await getBorrowUserData(lendingPool, deployer)

    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    console.log(`You can borrow ${amountDaiToBorrow} DAI`)

    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)

    await getBorrowUserData(lendingPool, deployer)
}


const getBorrowUserData = async(lendingPool, deployer)=>{
    const {totalCollateralETH, totalDebtETH, availableBorrowsETH} = await lendingPool.getUserAccountData(deployer);

    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH .`)

    return {availableBorrowsETH, totalDebtETH}
}

async function getDaiPrice(){
    // Deployer isn't needed as we are only going to call a view function
    const daiEthPriceFeed = await ethers.getContractAt("IAggregatorV3Interface", "0x773616E4d11A78F511299002da57A0a94577F1f4") // Hardcoded

    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)

    return price;
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, signerAccount){
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, signerAccount)
    await borrowTx.wait(1)
    console.log("You've Borrowed")
}