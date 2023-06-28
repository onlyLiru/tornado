import styles from "@/app/home.module.css";
import { Space, Avatar, Card, Button, Toast, Grid } from "antd-mobile";
import copy from "copy-to-clipboard";
import { CollectMoneyOutline } from "antd-mobile-icons";

interface IProps {
  noteString: string;
}

const DepositTipContent: React.FC<IProps> = (props) => {
  return (
    <>
      <Space block justify="center" className={styles.title}>
        存款成功
      </Space>
      <Space block direction="vertical">
        <h3>交易凭证</h3>
        <Space
          block
          justify="between"
          style={{
            background: "#F5F7FA",
            borderRadius: "1.5rem",
            padding: ".5rem .75rem",
            border: "1px solid rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "15rem",
              display: "block",
            }}
          >
            {props.noteString}
          </span>
          <CollectMoneyOutline
            onClick={() => {
              localStorage.setItem("noteString", props.noteString);
              copy(props.noteString);
              Toast.show("复制成功");
            }}
          />
        </Space>
      </Space>
    </>
  );
};

export default DepositTipContent;
