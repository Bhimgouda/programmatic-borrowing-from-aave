const { borrow } = require("./borrow")
const { depositCollateral } = require("./depositCollateral")
const { getWeth } = require("./getWeth")

main()
.then(() => process.exit(0))
.catch((error) =>{
    console.log(error)
    process.exit(1)
})

async function main(){

    // Aave protocol treats everything as erc20 token
    // 1. That's why we got WETH erc20 Token from ETH
    await getWeth()

    const lendingPool = await depositCollateral()

    await borrow(lendingPool)
}






