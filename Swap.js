const { ethers } = require("ethers");

// RPC dan Router info
const RPC_URL = "https://rpc.matchain.io";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const ROUTER_ADDRESS = "0x83700f69b0173ebb46fdad89a4b27eb7ef171118";
const LOL_ADDRESS = "0xB2174052dd2F3FCAB9Ba622F2e04FBEA13fc0dFC";
const USDT_ADDRESS = "0xB6dc6C8b71e88642cEAD3be1025565A9eE74d1C6";

// ABI minimal untuk getAmountsOut
const routerAbi = [
  "function getAmountsOut(uint256 amountIn, address[] memory path) view returns (uint256[] memory)"
];

// Persentase estimasi saat ini (misal 82,74%)
const originalPercentage = 0.8274;

async function main() {
  const router = new ethers.Contract(ROUTER_ADDRESS, routerAbi, provider);

  // Asumsikan 18 desimal, sesuaikan jika USDT pakai 6 desimal
  const amountIn = ethers.parseUnits("1000000000", 18); // 1 miliar LOL
  const path = [LOL_ADDRESS, USDT_ADDRESS];

  try {
    const amounts = await router.getAmountsOut(amountIn, path);
    
    // Ganti 18 ke 6 jika USDT di jaringan ini punya 6 desimal
    const rawUsdt = ethers.formatUnits(amounts[1], 18);

    // Konversi ke Number agar bisa format eksponensial
    const rawUsdtNumber = Number(rawUsdt);
    const correctedUsdtNumber = rawUsdtNumber / originalPercentage;

    console.log(`Perkiraan swap (asli): ${rawUsdtNumber.toExponential()} USDT (82.74%)`);
    console.log(`Perkiraan swap (100%): ${correctedUsdtNumber.toExponential()} USDT`);
  } catch (err) {
    console.error("Gagal mengambil data swap:", err);
  }
}

main();