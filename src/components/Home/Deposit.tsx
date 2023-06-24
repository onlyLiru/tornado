import { Button, Space, Image, Dialog, Result } from 'antd-mobile';
import styles from '@/pages/index.module.css';
import AmountSelector from './AmountSelector';
import CurrencySelector from './CurrencySelector';
import { useState } from 'react';
import deposit from '@/assets/deposit@2x.png';
import withdraw from '@/assets/withdraw@2x.png';
import store from '@/store';
import ExchangeGasContent from './ExchangeGasContent';

export default () => {
  const [amount, setAmout] = useState(0.1);
  const [depositState, depositDispatchers] = store.useModel('deposit');

  console.log(depositState.exchange);

  const handleChangeUsdc = (v) => {
    depositDispatchers.updateExchange(v);
  };

  const handleExchangeGas = () => {
    Dialog.confirm({
      content: <ExchangeGasContent {...{ exchange: depositState.exchange, handleChangeUsdc }} />,
      confirmText: '确定兑换',
      cancelText: <span style={{ color: 'gray' }}>我再想想</span>,
      onConfirm() {
        alert();
      },
    });
  };

  const exchangeTipContent = <Result status="success" title="兑换成功" />;
  const handleExchangeSuccess = () => {
    Dialog.alert({
      content: exchangeTipContent,
      confirmText: '确定',
      onConfirm: () => {
        console.log('Confirmed');
      },
    });
  };

  const handleSelect = (amount: number) => {
    setAmout(amount);
  };

  const handleDeposit = () => {
    // handleExchangeSuccess();
    handleExchangeGas();
  };
  const handleChangeTab = () => {
    depositDispatchers.updateTab(depositState.currentTab);
  };

  const text = depositState.currentTab === 'deposit' ? '存入' : '提取';

  return (
    <div className={styles.deposit}>
      <div className={styles['tab-title']} onClick={handleChangeTab}>
        <Image
          src={depositState.currentTab === 'deposit' ? deposit : withdraw}
        />
      </div>
      <div className={styles.inner}>
        <Space
          {...{
            block: true,
            direction: 'vertical',
            style: { '--gap': '24px' },
          }}
        >
          <h3 className={styles.title}>代币</h3>
          <CurrencySelector />
          <h3 className={styles.title}>数额</h3>
          <AmountSelector handleSelect={handleSelect} />
          <Button
            onClick={handleDeposit}
            block
            color="primary"
            style={{ borderRadius: '1.5rem' }}
            size="large"
          >
            {text}
            {amount}ETH
          </Button>
        </Space>
      </div>
    </div>
  );
};
