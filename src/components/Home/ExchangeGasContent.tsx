import { Space, Avatar, Input } from 'antd-mobile';
import styles from './home.module.css';
import AmountSlider from './AmountSlider';
import DirectionIcon from '@/assets/direction@2x.png';
import Dollar from '@/assets/dollar@2x.png';
import Eth from '@/assets/eth.png';
import { ExchangeInterface } from '@/interfaces/deposit';
import { useState } from 'react';

interface IProps {
  exchange: ExchangeInterface;
  handleChangeUsdc: (val: string) => void;
}

export default (props: IProps) => {
  const { usdc, eth } = props.exchange;
  const [val, setVal] = useState<string>(String(usdc));
    const [ethVal, setEthVal] = useState<number>(eth);

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
                    placeholder="请输入内容"
                    value={val}
                    onChange={(v) => {
                      setVal(v);
                      setEthVal(Number(v) / 1000);
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
                <span>{ethVal}</span>
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
