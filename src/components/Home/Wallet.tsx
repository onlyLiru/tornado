import styles from './home.module.css';
import {
  Toast,
  Space,
  CheckList,
  List,
  Avatar,
  Dialog,
} from 'antd-mobile';
import { RightOutline, GlobalOutline } from 'antd-mobile-icons';
import store from '@/store';
import { formatString } from '@/utils';
import Web3Utils from '@/utils/web3';
import MetaMaskIcon from '@/assets/metamask.png';
import MetaMask from '@/assets/metamask@2x.png';
import TrxIcon from '@/assets/trx@2x.png';

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  const { account } = depositState;
  let DialogInstance: any = null;

  const list = (
    <div>
      <Space block justify="center" className={styles.title}>
        连接钱包
      </Space>
      <CheckList
        value={[depositState.walletType]}
        style={{ '--border-bottom': '0', '--border-top': '0' }}
        onChange={async (v) => {
          if (!v.length) {
            DialogInstance?.close && DialogInstance.close();
            return;
          }

          depositDispatchers.updateWalletType(v[0]);

          if (Web3Utils[v[0]]) {
            const account = await Web3Utils[v[0]]();
            if (account) {
              depositDispatchers.updateAccount(account);
            }
          } else {
            Toast.show('在路上、马上到');
          }
          DialogInstance?.close && DialogInstance.close();
        }}
      >
        <CheckList.Item value="MetaMask">
          <Space align="center">
            <Avatar src={MetaMask} fit="contain" style={{ '--size': '2rem' }} />
            <span>MetaMask</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="TronLink">
          <Space align="center">
            <Avatar src={TrxIcon} fit="contain" style={{ '--size': '2rem' }} />
            <span>TronLink</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="WalletConnect">
          <Space align="center">
            <Avatar src={MetaMaskIcon} fit="contain" style={{ '--size': '1.5rem' }} />
            <span>WalletConnect</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ImToken">
          <Space align="center">
            <Avatar src={MetaMaskIcon} fit="contain" style={{ '--size': '1.5rem' }} />
            <span>ImToken</span>
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
    <div onClick={handleClick}>
      <List style={{ border: 'none' }}>
        <List.Item
          prefix={
            <Avatar
              src={MetaMaskIcon}
              style={{
                borderRadius: '100%',
                background: '#EFF4FA',
                padding: '10px',
                boxSizing: 'border-box',
              }}
              fit="fill"
            />
          }
          description="SeretRPC"
        >
          {formatString(account)}
        </List.Item>
      </List>
    </div>
  );
};
