import BN from "bn.js";
import { ethers, network } from "hardhat";
import Web3 from "web3";
import {
    TokenContract, TokenInstance,
    UniswapV2FactoryContract, UniswapV2FactoryInstance,
    UniswapV2PairContract,
    UniswapV2Router02Contract, UniswapV2Router02Instance
} from "../typechain-types";

const { abi, bytecode } = require('@uniswap/v2-core/build/UniswapV2Factory.json')

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";


/**
 * Helper wrapper to convert number to BN
 * @param x number expressed in any reasonable type
 * @returns same number as BN
 */
export function toBN(x: BN | number | string): BN {
    if (BN.isBN(x)) return x;
    return Web3.utils.toBN(x);
}

export async function latestBlockTimestamp() {
    const latestBlock = await web3.eth.getBlock('latest');
    return Number(latestBlock.timestamp);
}


function fullValue(i: any): BN {
    return toBN(10).pow(toBN(18)).mul(toBN(i));
}

const UniswapV2Factory: UniswapV2FactoryContract = artifacts.require('UniswapV2Factory')
const UniswapV2Pair: UniswapV2PairContract = artifacts.require('UniswapV2Pair')
const UniswapV2Router02: UniswapV2Router02Contract = artifacts.require('UniswapV2Router02')
const Token: TokenContract = artifacts.require('Token')

const networkName = network.name

// const UNISWAP_ROUTER_ADDRESS = "TODO - TO KAR PRIDE IZ DEPLOYMENTA" // "0xF09BabdC20d93a7D6315C112e47C825cF8E6f1c6"
// const UNISWAP_FACTORY_ADDRESS = "TODO - TO KAR PRIDE IZ DEPLOYMENTA" // "0x79487b724376278D1872a0fd250Db3C675Af38C1"

const UNISWAP_ROUTER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const UNISWAP_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

 const ALL_TOKENS = [
    '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
   ]

async function getUniswapRouter() {
    const router: UniswapV2Router02Instance = await UniswapV2Router02.at(
        UNISWAP_ROUTER_ADDRESS
    )
    return router
}

async function deployUniswapFactory(deployerOrigin: HardhatEthersSigner) {
    const Contract = await ethers.getContractFactory(abi, bytecode);
    const deployed = await Contract.deploy(deployerOrigin.address);
    await deployed.waitForDeployment();
    const factory: UniswapV2FactoryInstance = await UniswapV2Factory.at(deployed.target);
    const router: UniswapV2Router02Instance = await UniswapV2Router02.new(factory.address, "0x6641799AD609a54c928D2C2Aa58AF6a6EB650574");

    console.log("UniswapV2Factory deployed to:", factory.address);  // 0x5FbDB2315678afecb367f032d93F642f64180aa3
    console.log("UniswapV2Router02 deployed to:", router.address); // 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

    console.log(`yarn hardhat verify ${factory.address} --network ${networkName} ` + deployerOrigin.address) // This fails
    console.log(`yarn hardhat verify ${router.address} --network ${networkName} ` + factory.address + " " + "0x6641799AD609a54c928D2C2Aa58AF6a6EB650574")
}

async function deployTokens() {
    const tokens = []
    for (let num = 1; num < 5; ++num) {
        const tokenName = "Token" + num
        const tokenSymbol = "TOK" + num

        const maxSupply = fullValue(1000000000)

        const token: TokenInstance = await Token.new(tokenName, tokenSymbol, maxSupply)
        console.log(
            `yarn hardhat verify ${token.address} --network ${networkName} ${tokenName} ${tokenSymbol} ${maxSupply}`
        )
        tokens.push(token.address)
    }
    return tokens
}

async function bootstrapLiquidityPairPools(deployerOrigin: HardhatEthersSigner) {
    const uniRouter: UniswapV2Router02Instance = await UniswapV2Router02.at(UNISWAP_ROUTER_ADDRESS)

    const tokenList = ALL_TOKENS

    for (let i = 0; i < tokenList.length; ++i) {
        const t1 = await Token.at(tokenList[i])
        await t1.approve(uniRouter.address, fullValue(1000000000000000))
    }

    for (let i = 0; i < tokenList.length; ++i) {
        for (let j = i + 1; j < tokenList.length; ++j) {

            const t1 = await Token.at(tokenList[i])
            const t2 = await Token.at(tokenList[j])

            console.log(t1.address, t2.address, i, j)

            // await t1.approve(uniRouter.address, fullValue(10))
            // await t2.approve(uniRouter.address, fullValue(10))

            // console.log(
            //     (await t1.balanceOf(deployerOrigin.address)).toString(),
            // )
            // console.log(
            //     (await t2.balanceOf(deployerOrigin.address)).toString(),
            // )

            // console.log(
            //     (await t1.allowance(deployerOrigin.address, uniRouter.address)).toString(),
            // )

            // console.log(
            //     (await t2.allowance(deployerOrigin.address, uniRouter.address)).toString(),
            // )

            const prvi = await fullValue(50)
            const drugi = await fullValue(50000)

            await uniRouter.addLiquidity(
                t1.address, t2.address,
                prvi, drugi,      // manjsi bazen  5000, 5000000,   // vecji bazen   //100_000, 100_000,
                0, 0,
                deployerOrigin.address,
                (await latestBlockTimestamp() + 1000)
            )
        }
    }
}

// jst mislm da tok majhnega bazena, da bi bil 5 in 5000 tokenov notr ne naredi, ker je pac premejhen
// Error: VM Exception while processing transaction: reverted with reason string 'ds-math-sub-underflow'
// namesto da narediva tocno tak bazen ga mal spremeniva? 

// 99999999999999999999700 kok sva nardile tokna - tok kokr ga je v likvidnostnem bazenu
// 99999999999999999899800

// 99999999999999999700000
// 99999999999999999700000


async function runUniswap(num: number,
    deployerOrigin: HardhatEthersSigner,
) {
    console.log(1)

    const tokenList = ALL_TOKENS

    const tokenA: TokenInstance = await Token.at(tokenList[0])
    const tokenB: TokenInstance = await Token.at(tokenList[1])

    console.log(tokenA.address)
    console.log(tokenB.address)

    console.log((await tokenA.balanceOf(deployerOrigin.address)).toString())
    console.log((await tokenB.balanceOf(deployerOrigin.address)).toString())

    
    const router = await getUniswapRouter();
    await tokenA.approve(router.address, fullValue(1000000))
    await tokenB.approve(router.address, fullValue(1000000))

    // Address za par tokenov; da lahko dobis ven rezerve
    const factory: UniswapV2FactoryInstance = await UniswapV2Factory.at(UNISWAP_FACTORY_ADDRESS)
    const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
    const pair = await ethers.getContractAt("IUniswapV2Pair", pairAddress);
    // rezerve:
    const reserves1 = await pair.getReserves()
    console.log('Reserves:', reserves1)

    const vektor = []

    // swapneš   
    for (let i = 0; i < num; ++i) {
        console.log(i)

        // const t = await router.swapExactTokensForTokens(
        //     (toBN(5).mul(toBN(10).pow(toBN(16)))).toString(),
        //     0, [tokenA.address, tokenB.address],
        //     deployerOrigin.address,
        //     (await latestBlockTimestamp() + 1000)
        // )

        // await router.swapExactTokensForTokens(
        //     (toBN(5).mul(toBN(10).pow(toBN(16)))).toString(),
        //     0, [tokenB.address, tokenA.address],
        //     deployerOrigin.address,
        //     (await latestBlockTimestamp() + 1000)
        // )
        // console.log((await tokenA.balanceOf(deployerOrigin.address)).toString())
        // console.log((await tokenB.balanceOf(deployerOrigin.address)).toString())
   

    await router.swapExactTokensForTokens(
        (toBN(1).mul(toBN(10).pow(toBN(18)))).toString(),
        0, [tokenA.address, tokenB.address],
        deployerOrigin.address,
        (await latestBlockTimestamp() + 1000)
    )

    const reserves2 = await pair.getReserves()
    console.log('rezervice:',reserves2)

    const dY = reserves2[1] - reserves1[1]
    console.log('dY:', dY)
    vektor.push(dY)

    console.log((await tokenA.balanceOf(deployerOrigin.address)).toString())
    console.log((await tokenB.balanceOf(deployerOrigin.address)).toString())
    }

    console.log(vektor)  
}



async function main() {
    const [deployerOrigin, deployerTarget, originUser1, originUser2, destinationUser1, destinationUser2] = await ethers.getSigners();


    /* 1. Deploy uniswap factory and router - This only needs to be done once per network */
    await deployUniswapFactory(deployerOrigin)
    //return

    // 2. Deployamo zetone

    console.log("tokens:", await deployTokens());
    //return

    /* 3.1. Bootstrap liquidity pools */

    await bootstrapLiquidityPairPools(deployerOrigin)
    //return

    /* 4. Run uniswap */
    await runUniswap(
        3,
        deployerOrigin
    )

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}).then(() => process.exit());

