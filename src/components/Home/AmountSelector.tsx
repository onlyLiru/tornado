import styles from '@/pages/index.module.css';
import { Space } from 'antd-mobile';
import classNames from 'classnames/bind';
import { useState } from 'react';

let cx = classNames.bind(styles);

export default (props: { handleSelect: (amount: number) => void }) => {
  const [list] = useState([0.1, 1, 10, 100]);
  const [current, setCurrent] = useState(0);

  const handleSelect = (i: number) => {
    setCurrent(i);
    props.handleSelect(list[i]);
  };

  return (
    <div className={styles['amount-selector']}>
      <span className={styles.line} />
      <Space {...{ block: true, justify: 'between' }}>
        {list.map((item, i) => (
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
            <span className={styles.amount}>{item}ETH</span>
          </Space>
        ))}
      </Space>
    </div>
  );
};
