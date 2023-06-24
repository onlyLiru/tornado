import { definePageConfig } from 'ice';
import { Button, Card, Grid, Space, Image, List, Avatar } from 'antd-mobile';
import styles from '@/pages/index.module.css';
import Logo from '../assets/metamask-logo.svg';
import Wallet from '@/components/Home/Wallet';
import ThemeSwitch from '@/components/Home/ThemeSwitch';
import Deposit from '@/components/Home/Deposit';
import TransferRecord from '@/components/Home/TransferRecord';
import { useEffect } from 'react';

export default function IndexPage() {
  useEffect(() => {
      // userDispatchers.getUserInfo();
      // setTimeout(() => { themeDispatchers.updateTheme('dark'); }, 1000);
    }, []);
  return (
    <Space
      {...{ block: true, direction: 'vertical', className: styles.container }}
      style={{ '--gap-vertical': '1rem' }}
    >
      <Grid columns={2} gap={8}>
        <Grid.Item>
          <Wallet />
        </Grid.Item>
        <Grid.Item className={styles.moon}>
          <ThemeSwitch />
        </Grid.Item>
      </Grid>
      <Deposit />
      <TransferRecord />
      <Card
        headerStyle={{
          fontSize: '1rem',
        }}
        title={
          <div style={{ fontWeight: 'normal' }}>捐赠地址：0dfoiejewro0oif</div>
        }
      />
    </Space>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin', 'user'],
  };
});
