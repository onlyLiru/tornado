import { atom } from "recoil";

export interface ExchangeInterface {
  usdc: number;
  eth: number;
  isShowDialog: boolean;
}

type amountType = 0.1 | 1 | 10 | 100;

interface IDeposit {
  currentTab: "deposit" | "withdraw";
  currency: "USDC" | "ETH";
  amountList: amountType[];
  amount: amountType;
  exchange: ExchangeInterface;
}

export const depositState = atom<IDeposit>({
  key: "depositState",
  default: {
    currentTab: "deposit",
    currency: "ETH",
    amountList: [0.1, 1, 10, 100],
    amount: 0.1,
    exchange: {
      usdc: 1,
      eth: 0.002,
      isShowDialog: false,
    },
  },
});
