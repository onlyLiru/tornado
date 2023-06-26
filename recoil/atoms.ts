import { atom } from "recoil";

interface Atom {
  amount: number;
  account: string;
}

export const counterState = atom<Atom>({
  key: "counterState",
  default: { amount: 0, account: "cccc" },
});
