"use client";

import styles from "./home.module.css";
import { Space, Dialog, CheckList, Avatar } from "antd-mobile";
import classNames from "classnames/bind";
import { RightOutline } from "antd-mobile-icons";
import EthIcon from "@/public/dollar@2x.png";
import Dollar from "@/public/eth@3x.png";
import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

let cx = classNames.bind(styles);

export default function CurrencySelector() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  let DialogInstance: any = null;

  const currentIcon = depositState.currency === "USDC" ? EthIcon : Dollar;

  const list = (
    <div>
      <Space block justify="center" className={styles.title}>
        切换代币
      </Space>
      <CheckList
        value={[depositState.currency]}
        style={{ "--border-bottom": "0", "--border-top": "0" }}
        onChange={(v) => {
          setDepositState({
            ...depositState,
            currency: v[0] as any,
          });
          DialogInstance?.close && DialogInstance.close();
        }}
      >
        <CheckList.Item value="USDC">
          <Space>
            <Avatar
              src={EthIcon.src}
              fit="contain"
              style={{ "--size": "1.5rem" }}
            />
            <span>USDC</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ETH">
          <Space>
            <Avatar
              src={Dollar.src}
              fit="contain"
              style={{ "--size": "1.5rem" }}
            />
            <span>ETH</span>
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
    <Space
      block
      align="center"
      justify="between"
      className={cx({
        "currency-selector": true,
      })}
      onClick={handleClick}
    >
      <Space align="center" block>
        <Avatar
          src={currentIcon.src}
          fit="contain"
          style={{ "--size": "1.5rem" }}
        />
        <span>{depositState.currency}</span>
      </Space>
      <span>
        <RightOutline />
      </span>
    </Space>
  );
}
