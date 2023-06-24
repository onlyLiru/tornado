/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { DepositInterface } from '@/interfaces/deposit';
import { createModel } from 'ice';


export default createModel({
  state: {
    currentTab: 'deposit',
    currency: 'ETH',
    walletType: 'ImToken',
    exchange: {
      usdc: 1,
      eth: 0.002,
    },
  } as DepositInterface,
  reducers: {
    updateTab(prevState: DepositInterface, payload) {
      prevState.currentTab = payload === 'deposit' ? 'widthdraw' : 'deposit';
    },
    updateCurrency(prevState: DepositInterface, payload) {
      if (payload) {
        prevState.currency = payload;
      }
    },
    updateWalletType(prevState: DepositInterface, payload) {
      if (payload) {
        prevState.walletType = payload;
      }
    },
    updateExchange(prevState: DepositInterface, payload) {
      // const usdc = payload || 1;
      prevState.exchange = {
        usdc: payload,
        eth: payload >= 1 ? payload / 1000 : 0,
      };
    },
  },
});
