import { atom } from "recoil";

interface IWallet {
  type: "MetaMask" | "TronLink" | "WalletConnect" | "ImToken" | "";
  account: string;
}

export const walletState = atom<IWallet>({
  key: "walletState",
  default: {
    type: "",
    account: "",
  },
});
