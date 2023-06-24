import { Button, Space, Image } from 'antd-mobile';
import styles from '@/pages/index.module.css';
import AmountSelector from './AmountSelector';
import CurrencySelector from './CurrencySelector';
import deposit from '@/assets/deposit@2x.png';
import withdraw from '@/assets/withdraw@2x.png';
import store from '@/store';
import ExchangeGas from './ExchangeGas';

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  const { amount } = depositState;

  const handleExchangeGas = () => {
    depositDispatchers.updateExchange({ isShowDialog: true });
  };

  const handleDeposit = () => {
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
          <AmountSelector />
          <Button
            onClick={handleDeposit}
            block
            color="primary"
            style={{ borderRadius: '1.5rem' }}
            size="large"
          >
            {text}
            {amount} {depositState.currency}
          </Button>
        </Space>
      </div>
      <ExchangeGas />
    </div>
  );
};
