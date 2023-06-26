"use client";

import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { generateRandomNumber, generateRandomHex } from "@/utils";
import { Card, Space } from "antd-mobile";
import styles from "./scroll.module.css";
import { RedoOutline } from "antd-mobile-icons";
import { useState } from "react";

var settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  autoplay: true,
  arrows: false,
};

const VerticalCarousel: React.FC = () => {
  const createItem = () => {
    return {
      timestamp: new Date().toISOString(),
      address: generateRandomHex(),
      amount: generateRandomNumber(0.1, 100, 2),
      time: generateRandomNumber(1, 60, 0),
    };
  };

  const [items, setItems] = useState(
    new Array(10).fill(0).map(() => createItem())
  );

  const clear = () => {
    setItems([]);
    setTimeout(() => {
      setItems(new Array(10).fill(0).map(() => createItem()));
    }, 800);
  };

  return (
    <Card
      headerStyle={{
        fontSize: "1.2rem",
      }}
      extra={<RedoOutline onClick={() => clear()} />}
      title={
        <div style={{ fontSize: "1.2rem", fontWeight: "normal" }}>
          今日
          <span style={{ color: "#31b7d3", margin: "0 2px" }}>
            {(items.length || 0) + 76589}
          </span>
          用户存款
        </div>
      }
      style={{ borderRadius: "20px", height: "11.6rem" }}
    >
      <div className={styles["scrollable-wrapper"]}>
        <Slider {...settings}>
          {items.map((item, i) => (
            <div key={i} suppressHydrationWarning>
              <Space
                {...{ block: true, justify: "around" }}
                style={{ "--gap": "24px", height: "2.5rem", width: "100%" }}
              >
                <div suppressHydrationWarning className={styles.item}>{item.address}</div>
                <div suppressHydrationWarning className={styles.item}>{item.time}分钟前</div>
                <div suppressHydrationWarning className={styles.item}>{item.amount}ETH</div>
              </Space>
            </div>
          ))}
        </Slider>
      </div>
    </Card>
  );
};

export default VerticalCarousel;
