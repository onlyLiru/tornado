const { bigInt } = require("@/snarkjs");
import MerkleTree from "fixed-merkle-tree";
import websnark from "@/websnark";

const assert = require("assert");

const websnarkUtils = require("websnark/src/utils");
import { createDeposit, toHex } from "../deposit";

let contract = null,
  groth16 = undefined;
const MERKLE_TREE_HEIGHT = 20;

const connectContract = async () => {
  const web3 = window.web3;
  const contractJson = require("@/contracts/TornadoCash_Eth_01.sol/TornadoCash_Eth_01.json");

  const address = "0x1087C3ec5CA2C0B5c768F864C525ac8feE4983b6";
  const contract = new web3.eth.Contract(contractJson.abi, address);
  return contract;
};

/**
 * Do an ETH withdrawal
 * @param note Note to withdraw
 * @param recipient Recipient address
 */
export async function withdraw(note, recipient) {
  groth16 = await websnark.buildGroth16();
  const deposit = parseNote(note);
  // deposit.preimage = deposit.preimage.buffer;
  console.log(deposit);
  contract = await connectContract({}, async (contract) => {
    return contract;
  });

  const { proof, args } = await generateSnarkProof(deposit, recipient);
  console.log("Sending withdrawal transaction...");
  console.log("proof:", proof);
  console.log("args:", args);
  return contract.methods
    .withdraw(proof, ...args)
    .send({ from: recipient, gas: 1e6, gasPrice: 5e9 });
}

/**
 * Parses Tornado.cash note
 * @param noteString the note
 */
function parseNote(noteString) {
  const noteRegex =
    /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  const match = noteRegex.exec(noteString);

  // we are ignoring `currency`, `amount`, and `netId` for this minimal example
  console.log(match.groups.note);
  const buf = Buffer.from(match.groups.note, "hex");
  const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const secret = bigInt.leBuff2int(buf.slice(31, 62));

  return createDeposit({ nullifier, secret });
}

/**
 * Generate SNARK proof for withdrawal
 * @param deposit Deposit object
 * @param recipient Funds recipient
 */
async function generateSnarkProof(deposit, recipient) {
  // Compute merkle proof of our commitment
  const { root, pathElements, pathIndices } = await generateMerkleProof(
    deposit
  );

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: 0,
    fee: 0,
    refund: 0,

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  console.log("Generating SNARK proof...");
  const proving_key = await (
    await fetch("withdraw_proving_key.bin")
  ).arrayBuffer();
  console.log(proving_key);
  const circuit = await (await fetch("withdraw.json")).json();

  const proofData = await websnarkUtils.genWitnessAndProve(
    groth16,
    input,
    circuit,
    proving_key
  );

  const { proof } = websnarkUtils.toSolidityInput(proofData);

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

/**
 * Generate merkle tree for a deposit.
 * Download deposit events from the contract, reconstructs merkle tree, finds our deposit leaf
 * in it and generates merkle proof
 * @param deposit Deposit object
 */
async function generateMerkleProof(deposit) {
  console.log("Getting contract state...");
  const events = await contract.getPastEvents("Deposit", {
    fromBlock: 0,
    toBlock: "latest",
  });
  const leaves = events
    .sort((a, b) => {
      if (a.returnValues.leafIndex > b.returnValues.leafIndex) {
        return 1;
      } else if (a.returnValues.leafIndex < b.returnValues.leafIndex) {
        return -1;
      }
      return 0;
    }) // Sort events in chronological order
    .map((e) => e.returnValues.commitment);
  let getLastRoot = await contract.methods.getLastRoot().call();
  const tree = new MerkleTree(MERKLE_TREE_HEIGHT, leaves);

  // Find current commitment in the tree
  let depositEvent = events.find(
    (e) => e.returnValues.commitment === toHex(deposit.commitment)
  );
  let leafIndex = depositEvent ? depositEvent.returnValues.leafIndex : -1;
  leafIndex = Number(leafIndex);
  // Validate that our data is correct (optional)
  let root = toHex(tree.root());
  const isValidRoot = await contract.methods.isKnownRoot(root).call();
  const isSpent = await contract.methods
    .isSpent(toHex(deposit.nullifierHash))
    .call();

  assert(isValidRoot === true, "Merkle tree is corrupted");
  assert(isSpent === false, "The note is already spent");
  assert(leafIndex >= 0, "The deposit is not found in the tree");

  // Compute merkle proof of our commitment
  const { pathElements, pathIndices } = tree.path(leafIndex);
  return { pathElements, pathIndices, root: tree.root() };
}
