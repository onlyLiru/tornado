"use client";

import { Slider, Space } from "antd-mobile";
import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

export default function AmountSlider() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { exchange: exchangeState } = depositState;

  return (
    <Space block direction="vertical">
      <Slider
        onChange={(v) => {
          setDepositState({
            ...depositState,
            exchange: {
              ...exchangeState,
              usdc: Number(v),
            },
          });
        }}
        step={1}
        min={1}
        max={1000}
        ticks
        value={exchangeState.usdc}
      />
      <Space
        block
        justify="between"
        style={{ fontSize: ".8rem", color: "#999" }}
      >
        <span>1USDC</span>
        <span>1000USDC</span>
      </Space>
    </Space>
  );
}
