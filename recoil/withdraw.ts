import { atom } from "recoil";

interface IWithdraw {
  noteString: string;
  recipient: string;
}

export const withdraw = atom<IWithdraw>({
  key: "withdraw",
  default: {
    noteString: "",
    recipient: "",
  },
});
