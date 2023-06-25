import styles from './home.module.css';
import { Space, Dialog, CheckList, Avatar } from 'antd-mobile';
import classNames from 'classnames/bind';
import { RightOutline, GlobalOutline } from 'antd-mobile-icons';
import store from '@/store';
import EthIcon from '@/assets/dollar@2x.png';
import Dollar from '@/assets/eth@3x.png';

let cx = classNames.bind(styles);

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  let DialogInstance: any = null;

  const currentIcon = depositState.currency === 'USDC' ? EthIcon : Dollar;

  const list = (
    <div>
      <Space block justify="center" className={styles.title}>
        切换代币
      </Space>
      <CheckList
        value={[depositState.currency]}
        style={{ '--border-bottom': '0', '--border-top': '0' }}
        onChange={(v) => {
          depositDispatchers.updateCurrency(v[0]);
          DialogInstance?.close && DialogInstance.close();
        }}
      >
        <CheckList.Item value="USDC">
          <Space>
            <Avatar src={EthIcon} fit="contain" style={{ '--size': '1.5rem' }} />
            <span>USDC</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ETH">
          <Space>
            <Avatar src={Dollar} fit="contain" style={{ '--size': '1.5rem' }} />
            <span>ETH</span>
          </Space>
        </CheckList.Item>
      </CheckList>
    </div>
  );

  const handleClick = () => {
    DialogInstance = Dialog.show({
      content: list,
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: <span style={{ color: 'gray' }}>取消</span>,
          },
          {
            key: 'confirm',
            text: '确定',
          },
        ],
      ],
    });
  };

  return (
    <Space
      block
      align="center"
      justify="between"
      className={cx({
        'currency-selector': true,
      })}
      onClick={handleClick}
    >
      <Space align="center">
        <Avatar src={currentIcon} fit="contain" style={{ '--size': '1.3rem' }} />
        {depositState.currency}
      </Space>
      <span>
        <RightOutline />
      </span>
    </Space>
  );
};
