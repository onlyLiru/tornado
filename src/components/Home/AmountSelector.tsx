import styles from '@/pages/index.module.css';
import { Space } from 'antd-mobile';
import classNames from 'classnames/bind';
import { useState } from 'react';
import store from '@/store';

let cx = classNames.bind(styles);

export default () => {
  const [depositState, depositDispatchers] = store.useModel('deposit');
  const { amountList, currency } = depositState;
  const [current, setCurrent] = useState(0);

  const handleSelect = (i: number) => {
    setCurrent(i);
    depositDispatchers.updateAmount(amountList[i]);
  };

  return (
    <div className={styles['amount-selector']}>
      <span className={styles.line} />
      <Space {...{ block: true, justify: 'between' }}>
        {depositState.amountList.map((item, i) => (
          <Space
            key={i}
            className={cx({
              'selector-item': true,
              current: i === current,
            })}
            direction="vertical"
            align="center"
            style={{ '--gap-vertical': '1rem' }}
            onClick={() => handleSelect(i)}
          >
            <span className={styles.dot} />
            <span className={styles.amount}>{item} {currency}</span>
          </Space>
        ))}
      </Space>
    </div>
  );
};
