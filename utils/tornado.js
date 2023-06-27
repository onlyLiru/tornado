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
