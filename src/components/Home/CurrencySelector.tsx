import styles from './home.module.css';
import { Space, Dialog, CheckList } from 'antd-mobile';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { RightOutline, GlobalOutline } from 'antd-mobile-icons';
import store from '@/store';

let cx = classNames.bind(styles);

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  let DialogInstance: any = null;

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
            <GlobalOutline />
            <span>USDC</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ETH">
          <Space>
            <GlobalOutline />
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
      <Space>
        <GlobalOutline />
        {depositState.currency}
      </Space>
      <span>
        <RightOutline />
      </span>
    </Space>
  );
};
