import React, { Component } from 'react';
import styles from './scroll.module.css';
import { Card, Space } from 'antd-mobile';
import { AntOutline, RedoOutline } from 'antd-mobile-icons';

import ScrollableFeed from 'react-scrollable-feed';
import { RandomColorGenerator } from './random-color-generator';
import { generateRandomNumber, generateRandomHex } from '@/utils';

export default class App extends Component {
  static intervalDelay = 1800;

  constructor(props) {
    super(props);

    this.scrollableRef = React.createRef();
  }

  state = {
    isAtBottom: true,
    items: new Array(10).fill(0).map(() => this.createItem()),
    interval: undefined,
  };

  updateIsAtBottomState(result) {
    this.setState({
      isAtBottom: result,
    });
  }

  createItem() {
    return {
      timestamp: new Date().toISOString(),
      color: RandomColorGenerator.get(),
      address: generateRandomHex(),
      amount: generateRandomNumber(0.1, 100, 2),
      time: generateRandomNumber(1, 60, 0),
    };
  }

  addItem() {
    this.setState((prevState) => ({
      items: [...prevState.items, this.createItem()],
    }));
  }

  pause() {
    clearInterval(this.state.interval);
    this.setState((_) => ({
      interval: undefined,
    }));
  }

  resume() {
    const interval = setInterval(() => {
      this.addItem();
    }, App.intervalDelay);
    this.setState((_) => ({
      interval,
    }));
  }

  clear() {
    this.setState((_) => ({
      items: [],
    }));

    setTimeout(() => {
      this.setState((_) => ({
        items: new Array(10).fill(0).map(() => this.createItem()),
      }));
    }, 1000);
  }

  scrollToBottom() {
    this.scrollableRef.current.scrollToBottom();
  }

  componentDidMount() {
    this.resume();
  }

  render() {
    const { isAtBottom, items, interval } = this.state;

    return (
      <Card
        headerStyle={{
          fontSize: '1.2rem',
        }}
        extra={<RedoOutline onClick={() => this.clear()} />}
        title={
          <div style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>
            今日
            <span style={{ color: '#31b7d3', margin: '0 2px' }}>
              {(items.length || 0) + 76589}
            </span>
            用户存款
          </div>
        }
        style={{ borderRadius: '20px' }}
      >
        <div className={styles['scrollable-wrapper']}>
          <ScrollableFeed
            ref={this.scrollableRef}
            onScroll={(isAtBottom) => this.updateIsAtBottomState(isAtBottom)}
          >
            {items.map((item, i) => (
              <Space
                key={i}
                {...{ block: true, justify: 'around' }}
                style={{ '--gap': '24px', height: '2.5rem' }}
              >
                <div className={styles.item}>{item.address}</div>
                <div className={styles.item}>{item.time}分钟前</div>
                <div className={styles.item}>{item.amount}ETH</div>
              </Space>
            ))}
          </ScrollableFeed>
        </div>
        {/* <div className="text-center">
          <p>{items.length} items</p>
          <button onClick={() => this.addItem()} type="button" className="btn btn-primary m-2">Add Item</button>
          {interval ? (
            <button onClick={() => this.pause()} type="button" className="btn btn-primary m-2">Pause</button>
                ) : (
                  <button onClick={() => this.resume()} type="button" className="btn btn-primary m-2">Autoplay</button>
                  )}
          <button onClick={() => this.scrollToBottom()} disabled={isAtBottom} type="button" className="btn btn-primary m-2">Scroll to Bottom</button>
          <button onClick={() => this.clear()} type="button" className="btn btn-primary m-2">Clear</button>
        </div> */}
      </Card>
    );
  }
}
