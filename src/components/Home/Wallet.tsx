import styles from './home.module.css';
import { Button, Grid, Space, CheckList, List, Avatar, Dialog } from 'antd-mobile';
import { RightOutline, GlobalOutline } from 'antd-mobile-icons';
import store from '@/store';


export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  let DialogInstance: any = null;

  const list = (
    <div>
      <Space block justify="center" className={styles.title}>
        连接钱包
      </Space>
      <CheckList
        value={[depositState.walletType]}
        style={{ '--border-bottom': '0', '--border-top': '0' }}
        onChange={(v) => {
          depositDispatchers.updateWalletType(v[0]);
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
          prefix={<Avatar
            src=""
            style={{ borderRadius: '100%' }}
          />}
          description="SeretRPC"
        >
          3XHX…GWGS
        </List.Item>
      </List>
    </div>
  );
};
