import { Space, Avatar, Input } from 'antd-mobile';
import styles from './home.module.css';
import AmountSlider from './AmountSlider';
import DirectionIcon from '@/assets/direction@2x.png';
import Dollar from '@/assets/dollar@2x.png';
import Eth from '@/assets/eth.png';
import store from '@/store';

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  const { usdc, eth } = depositState.exchange;

  return (
    <>
      <Space block direction="vertical" style={{ gap: '1rem' }}>
        <Space block justify="center" className={styles.title}>
          gas费不足，请先兑换
        </Space>
        <Space block direction="vertical" className={styles.exchangeInputBox}>
          <div className={styles.item}>
            <Space block justify="between" align="center">
              <Avatar src={Dollar} fit="contain" style={{ '--size': '2rem' }} />
              <Space align="center">
                <span>
                  <Input
                    placeholder=""
                    value={String(usdc)}
                    onChange={(v) => {
                      depositDispatchers.updateExchange({ usdc: v });
                    }}
                    className={styles.inputNumber}
                    type="number"
                    min={1}
                    max={1000}
                  />
                </span>
                <span style={{ color: '#666' }}>USDC</span>
              </Space>
            </Space>
          </div>
          <div className={styles.item}>
            <Space block justify="between" align="center">
              <Avatar src={Eth} fit="contain" style={{ '--size': '2rem' }} />
              <Space>
                <span>{eth}</span>
                <span style={{ color: '#666' }}>ETH</span>
              </Space>
            </Space>
          </div>
          <div className={styles.direction}>
            <Avatar
              src={DirectionIcon}
              fit="contain"
              style={{ '--size': '1rem' }}
            />
          </div>
        </Space>
        <AmountSlider />
      </Space>
    </>
  );
};
