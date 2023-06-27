"use client";

import { Button, Space, Image } from "antd-mobile";
import styles from "@/app/index.module.css";
import AmountSelector from "./AmountSelector";
import CurrencySelector from "./CurrencySelector";
import depositIcon from "@/public/deposit@2x.png";
import withdrawIcon from "@/public/withdraw@2x.png";
import ExchangeGas from "./ExchangeGas";
import { walletState } from "@/recoil/wallet";
import Web3Utils from "@/utils/web3";
import { createInvoice } from "@/utils/tornado";
// import { createInvoice } from "@/utils/cli-ts";

import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

export default function Deposit() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { amount, exchange: exchangeState } = depositState;

  const [wallet, setWallet] = useRecoilState(walletState);

  const handleExchangeGas = () => {
    setDepositState({
      ...depositState,
      exchange: { ...exchangeState, isShowDialog: true },
    });
  };

  const handleDeposit = () => {
    // handleExchangeGas();
    if (depositState.currentTab === "deposit") {
      startDeposit();
    }
  };

  const startDeposit = async () => {
    // to do
    if (wallet.type && wallet.account === "Account") {
      console.log(typeof Web3Utils[wallet.type]);
      const res = await Web3Utils[wallet.type]();
      console.log(res);
    }
    const chainId = await (window as any).web3.eth.getChainId();
    const account = (await (window as any).web3.eth.getAccounts())[0];
    console.log(chainId, account, depositState.amount, depositState.currency);
    const result = await createInvoice({ currency: "eth", amount: 1, chainId: 233 })
    console.log(result)
  };

  const handleChangeTab = (tab: any) => {
    setDepositState({
      ...depositState,
      currentTab: tab,
    });
  };

  const text = depositState.currentTab === "deposit" ? "存入" : "提取";

  return (
    <div className={styles.deposit}>
      <div className={styles["tab-title"]}>
        <Image
          alt=""
          src={
            depositState.currentTab === "deposit"
              ? depositIcon.src
              : withdrawIcon.src
          }
        />
        <ul className={styles["tab-title-menu"]}>
          <li
            className={styles.item}
            onClick={() => handleChangeTab("deposit")}
          >
            deposit
          </li>
          <li
            className={styles.item}
            onClick={() => handleChangeTab("withdraw")}
          >
            withdraw
          </li>
        </ul>
      </div>
      <div className={styles.inner}>
        <Space
          {...{
            block: true,
            direction: "vertical",
            style: { "--gap": "24px" },
          }}
        >
          <h3 className={styles.title}>代币</h3>
          <CurrencySelector />
          <h3 className={styles.title}>数额</h3>
          <AmountSelector />
          <Button
            onClick={handleDeposit}
            block
            color="primary"
            style={{ borderRadius: "1.5rem" }}
            size="large"
          >
            {text}
            {amount} {depositState.currency}
          </Button>
        </Space>
      </div>
      <ExchangeGas />
    </div>
  );
}
