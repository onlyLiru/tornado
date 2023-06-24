import { Slider, Space } from 'antd-mobile';
import store from '@/store';

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');

  return (<Space block direction="vertical">
    <Slider
      onChange={(v) => {
        depositDispatchers.updateExchange({ usdc: v });
      }}
      step={1}
      min={1}
      max={1000}
      ticks
      value={depositState.exchange.usdc}
    />
    <Space block justify="between" style={{ fontSize: '.3rem', color: '#999' }}>
      <span>1USDC</span>
      <span>1000USDC</span>
    </Space>
  </Space>);
};