"use client";

import styles from "@/app/home.module.css";
import { Toast, Space, CheckList, List, Avatar, Dialog } from "antd-mobile";
import { formatString } from "@/utils";
import Web3Utils from "@/utils/web3";
import MetaMaskIcon from "@/public/metamask.png";
import MetaMask from "@/public/metamask@2x.png";
import TrxIcon from "@/public/trx@2x.png";
import { useRecoilState } from "recoil";
import { walletState } from "@/recoil/wallet";

export default function Wallet() {
  const [wallet, setWallet] = useRecoilState(walletState);
  let DialogInstance: any = null;

  const list = (
    <div>
      <Space block justify="center" className={styles.title}>
        连接钱包
      </Space>
      <CheckList
        value={[wallet.type]}
        style={{ "--border-bottom": "0", "--border-top": "0" }}
        onChange={async (v) => {
          if (!v.length) {
            DialogInstance?.close && DialogInstance.close();
            return;
          }

          const value: any = v[0];

          if (Web3Utils[value]) {
            const res = await Web3Utils[value]();
            console.log(res);
            if (res?.accounts) {
              setWallet({
                ...wallet,
                account: res?.accounts[0],
                type: value,
              });
            } else {
              setWallet({
                ...wallet,
                type: "",
                account: "",
              });
            }
          } else {
            setWallet({
              ...wallet,
              type: "",
              account: "",
            });
          }
          DialogInstance?.close && DialogInstance.close();
        }}
      >
        <CheckList.Item value="MetaMask">
          <Space align="center">
            <Avatar
              src={MetaMask.src}
              fit="contain"
              style={{ "--size": "2rem" }}
            />
            <span>MetaMask</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="TronLink">
          <Space align="center">
            <Avatar
              src={TrxIcon.src}
              fit="contain"
              style={{ "--size": "2rem" }}
            />
            <span>TronLink</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="WalletConnect">
          <Space align="center">
            <Avatar
              src={MetaMaskIcon.src}
              fit="contain"
              style={{ "--size": "1.5rem" }}
            />
            <span>WalletConnect</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ImToken">
          <Space align="center">
            <Avatar
              src={MetaMaskIcon.src}
              fit="contain"
              style={{ "--size": "1.5rem" }}
            />
            <span>ImToken</span>
          </Space>
        </CheckList.Item>
      </CheckList>
    </div>
  );

  const handleClick = () => {
    DialogInstance = Dialog.show({
      content: list,
      closeOnAction: true,
      actions: [
        [
          {
            key: "cancel",
            text: <span style={{ color: "gray" }}>取消</span>,
          },
          {
            key: "confirm",
            text: "确定",
          },
        ],
      ],
    });
  };

  return (
    <div onClick={handleClick}>
      <List className="wallet-box">
        <List.Item
          prefix={
            <Avatar
              src={MetaMaskIcon.src}
              style={{
                borderRadius: "100%",
                background: "#EFF4FA",
                padding: "10px",
                boxSizing: "border-box",
              }}
              fit="fill"
            />
          }
          description="SeretRPC"
        >
          {wallet?.account ? formatString(wallet?.account) : "No Connected"}
        </List.Item>
      </List>
    </div>
  );
}
