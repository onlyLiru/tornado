import { Slider, Toast, Space } from 'antd-mobile';
import store from '@/store';

export default () => {
    // const [depositState, depositDispatchers] = store.useModel('deposit');

    // console.log(depositState);

    const toastValue = (value: number | number[]) => {
        let text = '';
        if (typeof value === 'number') {
          text = `${value}`;
        } else {
          text = `[${value.join(',')}]`;
        }
        Toast.show(`当前选中值为：${text}`);
        console.log(value);
      };

    return (<Space block direction="vertical">
      <Slider
        // onAfterChange={toastValue}
        onChange={(v) => {
        console.log(v);
      }}
        step={1}
        min={1}
        max={1000}
        ticks
      />
      <Space block justify="between" style={{ fontSize: '.3rem', color: '#999' }}>
        <span>1USDC</span>
        <span>1000USDC</span>
      </Space>
    </Space>);
};