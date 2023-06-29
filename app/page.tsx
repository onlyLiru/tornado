"use client";
// import Web3Utils from '@/utils/web3'
import { Card, Grid, Space } from "antd-mobile";
import styles from "@/app/index.module.css";
import ThemeSwitch from "@/components/Home/ThemeSwitch";
import Wallet from "@/components/Home/Wallet";
import Deposit from "@/components/Home/Deposit";
import VerticalCarousel from "@/components/Home/VerticalCarousel";

export default function Home() {
  return (
    <div>
      <Space
        {...{ block: true, direction: "vertical" }}
        style={{ "--gap-vertical": "1rem" }}
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
        <VerticalCarousel />
        <Card
          headerStyle={{
            fontSize: "1rem",
          }}
          title={
            <div style={{ fontWeight: "normal" }}>
              捐赠地址：0dfoiejewro0oif
            </div>
          }
        />
      </Space>
    </div>
  );
}
