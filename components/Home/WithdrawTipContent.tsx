import styles from "@/app/home.module.css";
import { Space, Input } from "antd-mobile";
import MetaMaskIcon from "@/public/metamask.png";

interface IProps {
  noteString: string;
  recipient: string;
}

const WithdrawTipContent: React.FC<IProps> = (props) => {
  return (
    <>
      <Space block className={styles.title} justify="center">
        提款信息
      </Space>
      <Space block direction="vertical" style={{ gap: "1rem" }}>
        <Space block direction="vertical">
          <h3 className={styles.title}>凭证</h3>
          <Space
            block
            align="center"
            style={{
              background: "#F7F8FA",
              borderRadius: "1.5rem",
              padding: ".5rem 1rem",
              height: "2.5rem",
              boxSizing: "border-box",
              border: "1px solid rgba(0,0,0,0.2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.noteString}
          </Space>
        </Space>
        <Space block direction="vertical">
          <h3 className={styles.title}>收款地址</h3>
          <Space
            block
            align="center"
            style={{
              background: "#F7F8FA",
              borderRadius: "1.5rem",
              padding: ".5rem 1rem",
              height: "2.5rem",
              boxSizing: "border-box",
              border: "1px solid rgba(0,0,0,0.2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.recipient}
          </Space>
        </Space>
      </Space>
    </>
  );
};

export default WithdrawTipContent;
