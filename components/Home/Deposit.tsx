import { Button, Space, Image, Toast, Dialog } from "antd-mobile";
import styles from "@/app/index.module.css";
import AmountSelector from "./AmountSelector";
import CurrencySelector from "./CurrencySelector";
import DepositTipContent from "./DepositTipContent";
import DepositResultContent from "./DepositResultContent";
import depositIcon from "@/public/deposit@2x.png";
import withdrawIcon from "@/public/withdraw@2x.png";
import ExchangeGas from "./ExchangeGas";
import { walletState } from "@/recoil/wallet";
import Web3Utils from "@/utils/web3";
import { startDeposit } from "@/utils/deposit";
import copy from "copy-to-clipboard";
import WithDrawTabContent from "./WithDrawTabContent";

import { useRecoilState, useRecoilValue } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

export default function Deposit() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { amount, exchange: exchangeState } = depositState;

  const wallet = useRecoilValue(walletState);

  const handleExchangeGas = () => {
    setDepositState({
      ...depositState,
      exchange: { ...exchangeState, isShowDialog: true },
    });
  };

  const handleDeposit = async () => {
    // handleExchangeGas();
    if (!wallet.account || !wallet.type) {
      return Toast.show("请链接钱包");
    }
    if (depositState.currentTab === "deposit") {
      showDepositTip();
    } else {
      // withdraw(localStorage.getItem("noteString"), wallet.account);
    }
  };

  const showDepositTip = async () => {
    Dialog.confirm({
      content: <DepositTipContent {...wallet} {...{ amount }} />,
      cancelText: "我再想想",
      confirmText: "确定存款",
      onConfirm: async () => {
        const note = await startDeposit({ amount, account: wallet.account });
        console.log(note);
        showDepositResult({ note });
      },
    });
  };

  const showDepositResult = ({ note }: { note: string }) => {
    Dialog.alert({
      content: <DepositResultContent noteString={note} />,
      onConfirm: () => {
        copy(note);
        localStorage.setItem("noteString", note);
        Toast.show("复制成功");
      },
    });
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
        {depositState.currentTab === "deposit" ? (
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
        ) : (
          <WithDrawTabContent />
        )}
      </div>
      <ExchangeGas />
    </div>
  );
}
