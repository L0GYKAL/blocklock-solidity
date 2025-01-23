import { JsonRpcProvider, ethers } from "ethers";
import 'dotenv/config'
import {
    MockBlocklockReceiver,
    SignatureSchemeAddressProvider,
    SignatureSender,
    BlocklockSender,
    BlocklockSignatureScheme,
    DecryptionSender,
    DecryptionSender__factory,
    BlocklockSender__factory,
} from "../typechain-types";

// Usage:
// yarn ts-node scripts/chain-interaction.ts 

const RPC_URL = process.env.CALIBRATIONNET_RPC_URL;
// const RPC_URL = "http://127.0.0.1:8545"
const walletAddr = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function getWalletBalance(rpcUrl: string, walletAddress: string): Promise<void> {
    try {
        // Connect to the Ethereum network using the RPC URL
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Get the wallet balance
        const balance = await provider.getBalance(walletAddress);

        // Convert the balance from Wei to Ether and print it
        console.log(`Balance of ${walletAddress}: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
    }
}

async function latestBlockNumber(provider: JsonRpcProvider) {
    // Fetch the latest block number
    const latestBlockNumber = await provider.getBlockNumber();
    console.log(`Latest Block Number: ${latestBlockNumber}`);
}

async function main() {
    try {
        // Create a provider using the RPC URL
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        // Create a signer using the private key
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

        await latestBlockNumber(provider);
        await getWalletBalance(RPC_URL!, walletAddr);
        
        const blocklockSender = new ethers.Contract("0xfF66908E1d7d23ff62791505b2eC120128918F44", BlocklockSender__factory.abi, provider);
        // cast call 0xfF66908E1d7d23ff62791505b2eC120128918F44 "version()(string)" --rpc-url https://rpc.ankr.com/filecoin_testnet
        console.log("decryptionSender address from blocklockSender proxy", await blocklockSender.decryptionSender());

        const decryptionSender = new ethers.Contract("0x9297Bb1d423ef7386C8b2e6B7BdE377977FBedd3", DecryptionSender__factory.abi, provider);
        console.log("Version number from decryptionSender proxy",  await decryptionSender.version());

    } catch (error) {
        console.error("Error fetching latest block number:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });