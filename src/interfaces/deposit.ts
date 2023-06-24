export interface ExchangeInterface {
    usdc: number;
    eth: number;
    isShowDialog: boolean;
}

type amountType = 0.1 | 1 | 10 | 100;

export interface DepositInterface {
    currentTab: 'deposit' | 'widthdraw';
    currency: 'USDC' | 'ETH';
    walletType: 'MetaMask' | 'TronLink' | 'WalletConnect' | 'ImToken';
    exchange: ExchangeInterface;
    amountList: number[];
    amount: amountType;
    account: string;
  }