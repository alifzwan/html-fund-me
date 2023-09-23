// Javascript that we use in index.html

/* There's Two types of Front end here:
    1. Node.js    - we import dependencies by => require()
    2. Javascript - we import dependencies by => import
*/
/* What we need to send transaction:
    1. provider/connection to the blockchain
    2. signer/ wallet / someone with some gas
    3. contract that we are connectied with (Which require ABI and Address)
*/
/* List of function in this file:
    1. connect()    - Connection with metamask 
    2. fund()       - funding the contract
    3. withdraw()   - withdraw out of contract
    4. getBalance() - balance in the wallet

*/

/** Index.js()
 *@author - Alif Zakwan
 *@notice - This file is a javascript for our front end
 */

import { ethers } from "./ethers-5.6.esm.min.js" // We import node.js for Web Browser from this link: https://cdn.ethers.io/lib/ethers-5.1.esm.min.js
import { contractAddress, abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)

/** Connect()
 *  @function - This function connect our html website to our metamask
 *  @notice - If your window.ethereum is not undefined (which you're already have metamask), button "connect" will popout
 *  @notice - If the other way around, please install metamask
 */

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" }) // Connect with our metamask
        connectButton.innerHTML = "You're Connected!"
    } else {
        connectButton.innerHTML = "Please install Metamask!"
    }
}

/**Balance()
 *@function - This function will return our balance in wallet
 */

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

/** Fund()
 * @function                 - This function will fund the contract
 * @param {*} ethAmount      - amount of eth we gonna send
 * @provider                 - our wallet (metamask)
 * @Web3Provider             - similar like JsonRpcProvider
 * @signer                   - return wallet address that connected to us
 * @contract                 - getting our contract (contractAddress, abi, signer)
 * @transactionResponse      - making a transaction
 * @listenForTransactionMine -
 *
 */
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            // If transaction rejected, it will catch an error
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // Wait for tx to be mined
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
            return
        }
    }
}

/** listenForTransactionMine()
 * @function - This function tells the operation to wait for tx to be mined
 * @Promise  - Create a listener for the blockchain
 * @resolve  -
 */
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    }) // Creating a listener for the blockchain
}

/** Withdraw()
 *@function - this function will withdraw fund out the contract
 *
 *
 *
 */
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
