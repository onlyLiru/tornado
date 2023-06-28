import snarkjs from "@/snarkjs";
import circomlib from "@/circomlib";

const bigInt = snarkjs.bigInt;

/** Generate random number of specified byte length */
const rbigint = (nbytes) =>
  snarkjs.bigInt.leBuff2int(require("crypto").randomBytes(nbytes));

/** Compute pedersen hash */
const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

/** BigNumber to hex string of specified length */
function toHex(number, length = 32) {
  const str =
    number instanceof Buffer
      ? number.toString("hex")
      : bigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

/** Remove Decimal without rounding with BigNumber */
function rmDecimalBN(bigNum, decimals = 6) {
  return new BigNumber(bigNum)
    .times(BigNumber(10).pow(decimals))
    .integerValue(BigNumber.ROUND_DOWN)
    .div(BigNumber(10).pow(decimals))
    .toNumber();
}

/**
 * Create deposit object from secret and nullifier
 */
function createDeposit({ nullifier, secret }) {
  const deposit = { nullifier, secret };
  deposit.preimage = Buffer.concat([
    deposit.nullifier.leInt2Buff(31),
    deposit.secret.leInt2Buff(31),
  ]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);
  return deposit;
}

async function backupNote({ currency, amount, netId, note, noteString }) {
  return true;
  // try {
  //   await fs.writeFileSync(`./backup-tornado-${currency}-${amount}-${netId}-${note.slice(0, 10)}.txt`, noteString, 'utf8');
  //   console.log("Backed up deposit note as", `./backup-tornado-${currency}-${amount}-${netId}-${note.slice(0, 10)}.txt`);
  // } catch (e) {
  //   throw new Error('Writing backup note failed:', e);
  // }
}

async function backupInvoice({
  currency,
  amount,
  netId,
  commitmentNote,
  invoiceString,
}) {
  return true;
  // try {
  //   await fs.writeFileSync(`./backup-tornadoInvoice-${currency}-${amount}-${netId}-${commitmentNote.slice(0, 10)}.txt`, invoiceString, 'utf8');
  //   console.log("Backed up invoice as", `./backup-tornadoInvoice-${currency}-${amount}-${netId}-${commitmentNote.slice(0, 10)}.txt`)
  // } catch (e) {
  //   throw new Error('Writing backup invoice failed:', e)
  // }
}

/**
 * create a deposit invoice.
 * @param currency Сurrency
 * @param amount Deposit amount
 */
export async function createInvoice({ currency, amount, chainId }) {
  const deposit = createDeposit({
    nullifier: rbigint(31),
    secret: rbigint(31),
  });
  const note = toHex(deposit.preimage, 62);
  const noteString = `tornado-${currency}-${amount}-${chainId}-${note}`;
  console.log(`Your note: ${noteString}`);

  const commitmentNote = toHex(deposit.commitment);
  const invoiceString = `tornadoInvoice-${currency}-${amount}-${chainId}-${commitmentNote}`;
  console.log(`Your invoice for deposit: ${invoiceString}`);

  await backupNote({ currency, amount, netId: chainId, note, noteString });
  await backupInvoice({
    currency,
    amount,
    netId: chainId,
    commitmentNote,
    invoiceString,
  });

  return { noteString, invoiceString, deposit };
}

export const startDeposit = async ({ amount, account }) => {
  const depositResult = await createInvoice({
    currency: "eth",
    amount: 1,
    chainId: 233,
  });
  connectContract({ ...depositResult, amount, account });
};

const connectContract = async (depositResult) => {
  const web3 = window.web3;
  const { amount, account, deposit } = depositResult;

  const { commitment } = deposit;

  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_verifier",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_denomination",
          type: "uint256",
        },
        {
          internalType: "uint32",
          name: "_merkleTreeHeight",
          type: "uint32",
        },
        {
          internalType: "address",
          name: "_operator",
          type: "address",
        },
        {
          internalType: "address",
          name: "_hasher",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "commitment",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "leafIndex",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "nullifierHash",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "relayer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
      ],
      name: "Withdrawal",
      type: "event",
    },
    {
      inputs: [],
      name: "FIELD_SIZE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ROOT_HISTORY_SIZE",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ZERO_VALUE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOperator",
          type: "address",
        },
      ],
      name: "changeOperator",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "commitments",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "currentRootIndex",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "denomination",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_commitment",
          type: "bytes32",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "filledSubtrees",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "finishMigration",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getLastRoot",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_left",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "_right",
          type: "bytes32",
        },
      ],
      name: "hashLeftRight",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "hasher",
      outputs: [
        {
          internalType: "contract IHasher",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "_filledSubtrees",
          type: "bytes32[]",
        },
        {
          internalType: "bytes32",
          name: "_root",
          type: "bytes32",
        },
      ],
      name: "initializeTreeForMigration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_root",
          type: "bytes32",
        },
      ],
      name: "isKnownRoot",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isMigrated",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_nullifierHash",
          type: "bytes32",
        },
      ],
      name: "isSpent",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "_nullifierHashes",
          type: "bytes32[]",
        },
      ],
      name: "isSpentArray",
      outputs: [
        {
          internalType: "bool[]",
          name: "spent",
          type: "bool[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "levels",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "_commitments",
          type: "bytes32[]",
        },
        {
          internalType: "bytes32[]",
          name: "_nullifierHashes",
          type: "bytes32[]",
        },
      ],
      name: "migrateState",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "nextIndex",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "nullifierHashes",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "operator",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "roots",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newVerifier",
          type: "address",
        },
      ],
      name: "updateVerifier",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "verifier",
      outputs: [
        {
          internalType: "contract IVerifier",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "_proof",
          type: "bytes",
        },
        {
          internalType: "bytes32",
          name: "_root",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "_nullifierHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "_recipient",
          type: "address",
        },
        {
          internalType: "address",
          name: "_relayer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_fee",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_refund",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "zeros",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const address = "0x2226c371DB81dfB421225f4811269Bb6801b8839";
  const contract = new web3.eth.Contract(abi, address);

  console.log(deposit);

  const tx = await contract.methods
    .deposit(toHex(commitment))
    .send({
      value: web3.utils.toWei(amount, "ether"),
      from: account,
      gas: 2e6,
    });
  console.log(`https://sepolia.etherscan.io/tx/${tx.transactionHash}`);
  return `tornado-eth-${amount}-${netId}-${toHex(deposit.preimage, 62)}`;
};
