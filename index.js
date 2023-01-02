import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constant.js";

const connectBtn = document.getElementById("connectBtn");

const fundBtn = document.getElementById("fundBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const balanceBtn = document.getElementById("balanceBtn");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function connect() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectBtn.innerHTML = "Connected";
    } catch (error) {
      console.log(error);
      connectBtn.innerHTML = "An error occoured";
    }
  } else {
    connectBtn.innerHTML = "please install metamask";
  }
}

async function fund() {
  const ethamount = document.getElementById("ethAmount").value;
  console.log(ethamount);
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRespone = await contract.fund({
        value: ethers.utils.parseEther(ethamount),
      });
      // wait for transaction  to be completed
      await listenTxmine(txRespone, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenTxmine(txRes, provider) {
  console.log(`Mining ${txRes.hash}....`);
  return new Promise((resolve, reject) => {
    provider.once(txRes.hash, (txReceipt) => {
      console.log(`completed ${txReceipt.confirmations} confirmation`);
      resolve();
    });
  });
}

async function getBalance() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  console.log("withdrawing..");
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const trResponse = await contract.withdraw();
      await listenTxmine(trResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
