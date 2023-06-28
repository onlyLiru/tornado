import web3 from "web3";
import axios from "axios";
import assert from "assert";

const Web3Utils = web3.utils;
// const SocksProxyAgent = require("socks-proxy-agent");

let torPort, netId;

function getCurrentNetworkSymbol() {
  switch (netId) {
    case 56:
      return "BNB";
    case 100:
      return "xDAI";
    case 137:
      return "MATIC";
    case 43114:
      return "AVAX";
    default:
      return "ETH";
  }
}

/**
 * Do an ETH withdrawal
 * @param noteString Note to withdraw
 * @param recipient Recipient address
 */
export async function withdraw({
  deposit,
  currency,
  amount,
  recipient,
  relayerURL,
  refund = "0",
  senderAccount,
}) {
  let netSymbol = getCurrentNetworkSymbol();
  let options = {};
  //   if (currency === netSymbol.toLowerCase() && refund !== "0") {
  //     throw new Error(
  //       "The ETH purchase is supposted to be 0 for ETH withdrawals"
  //     );
  //   }
  refund = Web3Utils.toWei(refund, "ether");
  if (relayerURL) {
    // if (relayerURL.endsWith(".eth")) {
    //   throw new Error(
    //     "ENS name resolving is not supported. Please provide DNS name of the relayer. See instuctions in README.md"
    //   );
    // }
    // if (torPort) {
    //   options = {
    //     httpsAgent: new SocksProxyAgent("socks5h://127.0.0.1:" + torPort),
    //     headers: {
    //       "User-Agent":
    //         "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
    //     },
    //   };
    // }
    const relayerStatus = await axios.get(relayerURL + "/status", options);

    const { rewardAccount, netId, ethPrices, tornadoServiceFee } =
      relayerStatus.data;
    assert(
      netId === (await web3.eth.net.getId()) || netId === "*",
      "This relay is for different network"
    );
    console.log("Relay address:", rewardAccount);

    const gasPrice = await fetchGasPrice();

    const decimals = isTestRPC
      ? 18
      : config.deployments[`netId${netId}`][currency].decimals;
    const fee = calculateFee({
      currency,
      gasPrice,
      amount,
      refund,
      ethPrices,
      relayerServiceFee: tornadoServiceFee,
      decimals,
    });
    if (fee.gt(fromDecimals({ amount, decimals }))) {
      throw new Error("Too high refund");
    }

    const { proof, args } = await generateProof({
      deposit,
      currency,
      amount,
      recipient,
      relayerAddress: rewardAccount,
      fee,
      refund,
    });

    console.log("Sending withdraw transaction through relay");
    try {
      const response = await axios.post(
        relayerURL + "/v1/tornadoWithdraw",
        {
          contract: tornadoInstance,
          proof,
          args,
        },
        options
      );

      const { id } = response.data;

      const result = await getStatus(id, relayerURL, options);
      console.log("STATUS", result);
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.error);
      } else {
        console.error(e.message);
      }
    }
  } else {
    // using private key

    // check if the address of recepient matches with the account of provided private key from environment to prevent accidental use of deposit address for withdrawal transaction.
    // assert(
    //   recipient.toLowerCase() == senderAccount.toLowerCase(),
    //   "Withdrawal recepient mismatches with the account of provided private key from environment file"
    // );
    // const checkBalance = await web3.eth.getBalance(senderAccount);
    // assert(
    //   checkBalance !== 0,
    //   "You have 0 balance, make sure to fund account by withdrawing from tornado using relayer first"
    // );

    const { proof, args } = await generateProof({
      deposit,
      currency,
      amount,
      recipient,
      refund,
    });

    console.log("Submitting withdraw transaction");
    await generateTransaction(
      contractAddress,
      tornado.methods.withdraw(tornadoInstance, proof, ...args).encodeABI()
    );
  }
  if (currency === netSymbol.toLowerCase()) {
    await printETHBalance({ address: recipient, name: "Recipient" });
  } else {
    await printERC20Balance({ address: recipient, name: "Recipient" });
  }
  console.log("Done withdrawal from Tornado Cash");
}

/**
 * Generate SNARK proof for withdrawal
 * @param deposit Deposit object
 * @param recipient Funds recipient
 * @param relayer Relayer address
 * @param fee Relayer fee
 * @param refund Receive ether for exchanged tokens
 */
async function generateProof({
  deposit,
  currency,
  amount,
  recipient,
  relayerAddress = 0,
  fee = 0,
  refund = 0,
}) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = await generateMerkleProof(
    deposit,
    currency,
    amount
  );

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(relayerAddress),
    fee: bigInt(fee),
    refund: bigInt(refund),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  console.log("Generating SNARK proof");
  console.time("Proof time");
  const proofData = await websnarkUtils.genWitnessAndProve(
    groth16,
    input,
    circuit,
    proving_key
  );
  const { proof } = websnarkUtils.toSolidityInput(proofData);
  console.timeEnd("Proof time");

  const args = [
    toHex(input.root),
    toHex(input.nullifierHash),
    toHex(input.recipient, 20),
    toHex(input.relayer, 20),
    toHex(input.fee),
    toHex(input.refund),
  ];

  return { proof, args };
}


