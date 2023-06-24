import { Dialog, Result } from 'antd-mobile';
import store from '@/store';
import ExchangeGasContent from './ExchangeGasContent';

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  const { exchange } = depositState;

  const exchangeTipContent = <Result status="success" title="兑换成功" />;
  const handleExchangeSuccess = () => {
    Dialog.alert({
      content: exchangeTipContent,
      confirmText: '确定',
    });
  };

  return (
    <Dialog
      visible={exchange.isShowDialog}
      content=<ExchangeGasContent />
      closeOnAction
      onClose={() => {
        depositDispatchers.updateExchange({ isShowDialog: false });
      }}
      actions={[
        [
          {
            key: 'cancel',
            text: <span style={{ color: 'gray' }}>我再想想</span>,
          },
          {
            key: 'confirm',
            text: '确定兑换',
            onClick: handleExchangeSuccess,
          },
        ],
      ]}
    />
  );
};
