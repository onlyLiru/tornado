"use client";

import { Space, Avatar, Input } from "antd-mobile";
import styles from "./home.module.css";
import AmountSlider from "./AmountSlider";
import DirectionIcon from "@/public/direction@2x.png";
import Dollar from "@/public/dollar@2x.png";
import Eth from "@/public/eth@3x.png";
import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

export default function ExchangeGasContent() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { exchange: exchangeState } = depositState;
  const { usdc, eth } = exchangeState;

  return (
    <>
      <Space block direction="vertical" style={{ gap: "1rem" }}>
        <Space block justify="center" className={styles.title}>
          gas费不足，请先兑换
        </Space>
        <Space block direction="vertical" className={styles.exchangeInputBox}>
          <div className={styles.item}>
            <Space block justify="between" align="center">
              <Avatar
                src={Dollar.src}
                fit="contain"
                style={{ "--size": "2rem" }}
              />
              <Space align="center">
                <span>
                  <Input
                    placeholder=""
                    value={String(usdc)}
                    onChange={(v) => {
                      setDepositState({
                        ...depositState,
                        exchange: {
                          ...exchangeState,
                          usdc: Number(v),
                        },
                      });
                    }}
                    className={styles.inputNumber}
                    type="number"
                    min={1}
                    max={1000}
                  />
                </span>
                <span style={{ color: "#666" }}>USDC</span>
              </Space>
            </Space>
          </div>
          <div className={styles.item}>
            <Space block justify="between" align="center">
              <Avatar
                src={Eth.src}
                fit="contain"
                style={{ "--size": "2rem" }}
              />
              <Space>
                <span>{eth}</span>
                <span style={{ color: "#666" }}>ETH</span>
              </Space>
            </Space>
          </div>
          <div className={styles.direction}>
            <Avatar
              src={DirectionIcon.src}
              fit="contain"
              style={{ "--size": "1rem" }}
            />
          </div>
        </Space>
        <AmountSlider />
      </Space>
    </>
  );
}
