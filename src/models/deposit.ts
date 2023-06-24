/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { DepositInterface } from '@/interfaces/deposit';
import { createModel } from 'ice';


export default createModel({
  state: {
    currentTab: 'deposit',
    currency: 'ETH',
    walletType: 'ImToken',
    amountList: [0.1, 1, 10, 100],
    amount: 0.1,
    exchange: {
      usdc: 1,
      eth: 0.002,
      isShowDialog: false,
    },
  } as DepositInterface,
  reducers: {
    updateTab(prevState: DepositInterface, payload) {
      prevState.currentTab = payload === 'deposit' ? 'widthdraw' : 'deposit';
    },
    updateAmount(prevState: DepositInterface, payload) {
      prevState.amount = payload;
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
      const usdc = payload?.usdc ?? prevState.exchange.usdc;
      const eth = usdc >= 1 ? usdc / 1000 : 0;

      prevState.exchange = {
        ...prevState.exchange,
        ...payload,
        usdc,
        eth,
      };
    },
  },
});
