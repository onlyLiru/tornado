import styles from './home.module.css';
import {
  Button,
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
          <Space>
            <GlobalOutline />
            <span>MetaMask</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="TronLink">
          <Space>
            <GlobalOutline />
            <span>TronLink</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="WalletConnect">
          <Space>
            <GlobalOutline />
            <span>WalletConnect</span>
          </Space>
        </CheckList.Item>
        <CheckList.Item value="ImToken">
          <Space>
            <GlobalOutline />
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
