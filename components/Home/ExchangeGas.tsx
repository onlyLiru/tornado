"use client";

import { Dialog, Result } from "antd-mobile";
import ExchangeGasContent from "./ExchangeGasContent";
import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

export default function ExchangeGas() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { exchange: exchangeState } = depositState;

  const exchangeTipContent = <Result status="success" title="兑换成功" />;
  const handleExchangeSuccess = () => {
    Dialog.alert({
      content: exchangeTipContent,
      confirmText: "确定",
    });
  };

  return (
    <Dialog
      visible={exchangeState.isShowDialog}
      content={<ExchangeGasContent />}
      closeOnAction
      onClose={() => {
        setDepositState({
          ...depositState,
          exchange: { ...exchangeState, isShowDialog: false },
        });
      }}
      actions={[
        [
          {
            key: "cancel",
            text: <span style={{ color: "gray" }}>我再想想</span>,
          },
          {
            key: "confirm",
            text: "确定兑换",
            onClick: handleExchangeSuccess,
          },
        ],
      ]}
    />
  );
}
