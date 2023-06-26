import "./globals.css";
import RecoilRootWrapper from "@/wrappers/RecoilRootWrapper";
import styles from "@/app/index.module.css";


export const metadata = {
  title: "Tornado",
  description: "web3 tornado",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className={styles.container}>
          <RecoilRootWrapper>{children}</RecoilRootWrapper>
        </div>
      </body>
    </html>
  );
}
