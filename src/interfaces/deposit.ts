export interface ExchangeInterface {
    usdc: number;
    eth: number;
}

export interface DepositInterface {
    currentTab: 'deposit' | 'widthdraw';
    currency: 'USDC' | 'ETH';
    walletType: 'MetaMask' | 'TronLink' | 'WalletConnect' | 'ImToken';
    exchange: ExchangeInterface;
  }