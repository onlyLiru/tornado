import styles from "@/app/home.module.css";
import { Space, Avatar } from "antd-mobile";
import MetaMaskIcon from "@/public/metamask.png";

interface IProps {
  account: string;
  amount: number;
  type: string;
}

const DepositTipContent: React.FC<IProps> = (props) => {
  return (
    <>
      <Space block className={styles.title}>
        即将往您的账户
      </Space>
      <Space
        block
        direction="vertical"
        style={{
          background: "#F5F7FA",
          borderRadius: ".75rem",
          padding: "1rem",
        }}
      >
        <Space block>
          <Avatar
            src={MetaMaskIcon.src}
            fit="contain"
            style={{ "--size": "1.5rem" }}
          />
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "10rem",
            }}
          >
            {props.account}
          </span>
        </Space>
        <Space block>
          <span>存入:</span>
          <span>{props.amount} ETH</span>
        </Space>
      </Space>
    </>
  );
};

export default DepositTipContent;
