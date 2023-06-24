import { definePageConfig } from 'ice';
import { Card, Grid, Space } from 'antd-mobile';
import styles from '@/pages/index.module.css';
import Wallet from '@/components/Home/Wallet';
import ThemeSwitch from '@/components/Home/ThemeSwitch';
import Deposit from '@/components/Home/Deposit';
import TransferRecord from '@/components/Home/TransferRecord';

export default function IndexPage() {
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

export const pageConfig = definePageConfig(() => ({
  title: 'Home',
  metas: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    {
      title: 'Something cool',
      description: 'This becomes the nice preview on search results.',
    },
  ],
}));
