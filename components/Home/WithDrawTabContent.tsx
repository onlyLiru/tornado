import { Space, Button, Input, Toast, Dialog, Result } from "antd-mobile";
import styles from "@/app/index.module.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { withdraw as widthdrawRecoil } from "@/recoil/withdraw";
import { withdraw } from "@/utils/withdraw";
import { walletState as walletRecoil } from "@/recoil/wallet";
import WithdrawTipContent from "./WithdrawTipContent";

export default function WithDrawTabContent() {
  const [withdrawState, setWithdrawState] = useRecoilState(widthdrawRecoil);
  const wallet = useRecoilValue(walletRecoil);
  const { noteString, recipient } = withdrawState;

  const handleWithdraw = async () => {
    if (!wallet.account || !wallet.type) {
      return Toast.show("请链接钱包");
    }

    if (!noteString || noteString.length < 32) {
      return Toast.show("请输入正确的存款凭条");
    }

    if (!recipient) {
      return Toast.show("请输入收款地址");
    }
    showDepositTip();
  };

  const showDepositTip = async () => {
    Dialog.confirm({
      content: <WithdrawTipContent {...{ noteString, recipient }} />,
      cancelText: "我再想想",
      confirmText: "确定兑换",
      onConfirm: async () => {
        const tx = await withdraw(noteString, recipient || wallet.account);
        console.log(`https://sepolia.etherscan.io/tx/${tx.transactionHash}`);
        showDepositResult();
      },
    });
  };

  const showDepositResult = () => {
    const exchangeTipContent = <Result status="success" title="提款成功" />;
    Dialog.alert({
      content: exchangeTipContent,
      confirmText: "确定",
    });
  };

  return (
    <Space block direction="vertical" style={{ gap: "2rem" }}>
      <Space block direction="vertical">
        <h3 className={styles.title}>凭证</h3>
        <Input
          placeholder="请填写存款凭证"
          style={{
            background: "#E9ECF2",
            borderRadius: "1.5rem",
            padding: ".5rem 1rem",
            boxSizing: "border-box",
          }}
          onChange={(v) => {
            setWithdrawState({
              ...withdrawState,
              noteString: v,
            });
          }}
        />
      </Space>
      <Space block direction="vertical">
        <h3 className={styles.title}>收款地址</h3>
        <Input
          placeholder="请填写收款地址"
          style={{
            background: "#E9ECF2",
            borderRadius: "1.5rem",
            padding: ".5rem 1rem",
            boxSizing: "border-box",
          }}
          onChange={(v) => {
            setWithdrawState({
              ...withdrawState,
              recipient: v,
            });
          }}
        />
      </Space>
      <Button
        onClick={handleWithdraw}
        block
        color="primary"
        style={{ borderRadius: "1.5rem", marginTop: "1.6rem" }}
        size="large"
      >
        提款
      </Button>
    </Space>
  );
}
