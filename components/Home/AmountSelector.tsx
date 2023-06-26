"use client";

import styles from "@/app/index.module.css";
import { Space } from "antd-mobile";
import classNames from "classnames/bind";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { depositState as deposit } from "@/recoil/deposit";

let cx = classNames.bind(styles);

export default function AmoutSelector() {
  const [depositState, setDepositState] = useRecoilState(deposit);
  const { amountList, currency } = depositState;
  const [current, setCurrent] = useState(0);

  const handleSelect = (i: number) => {
    setCurrent(i);
    setDepositState({ ...depositState, amount: amountList[i] });
  };

  return (
    <div className={styles["amount-selector"]}>
      <span className={styles.line} />
      <Space {...{ block: true, justify: "between" }}>
        {depositState.amountList.map((item, i) => (
          <Space
            key={i}
            className={cx({
              "selector-item": true,
              current: i === current,
            })}
            direction="vertical"
            align="center"
            style={{ "--gap-vertical": "1rem" }}
            onClick={() => handleSelect(i)}
          >
            <span className={styles.dot} />
            <span className={styles.amount}>
              {item} {currency}
            </span>
          </Space>
        ))}
      </Space>
    </div>
  );
}
