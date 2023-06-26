import Web3 from "web3";

interface IWeb3Utils {}

export default {
  async MetaMask() {
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        // 请求用户授权
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        // 创建 Web3 实例
        // const web3 = new Web3(ethereum);
        const web3 = new Web3(
          new Web3.providers.HttpProvider("http://localhost:7545")
        );

        (window as any).web3 = web3;

        const accountsGanache = await web3.eth.getAccounts();
        console.log(accountsGanache);

        console.log(
          await ethereum.request({
            method: "eth_requestAccounts",
          })
        );

        // 获取用户的以太坊地址
        const account = accounts[0];

        console.log("Connected account:", account);
        console.log(
          await ethereum.request({
            method: "eth_getBalance",
            params: [account, "latest"],
          })
        );

        this.ConnectEth(account);
        return account;
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  },
  async ConnectEth(account: string) {
    // const web3 = new Web3('http://127.0.0.1:7545');
    const { web3 } = window as any;

    console.log(web3);
    web3.eth.getNodeInfo().then(console.log);

    const abi = [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "adoptId",
            type: "uint256",
          },
        ],
        name: "adopt",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "adopters",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAdopters",
        outputs: [
          {
            internalType: "address[16]",
            name: "",
            type: "address[16]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const address = "0xd4081B27dA9d5e44147FB49c1f959c3c79702E70";
    const contract = new web3.eth.Contract(abi, address);
    console.log(contract);

    const balance = await web3.eth.getBalance(
      "0x171e03485334252291939eF506b144BFC6f68aCE"
    );
    console.log(balance);
    const balanceFromWei = web3.utils.fromWei(balance, "ether");
    console.log(balanceFromWei);
    console.log(await contract.methods.getAdopters().call());

    // const res = await web3.eth.sendTransaction({
    //     from: '0x3cAcaaECdeEf3627A747398645C2c593e2b770FD',
    //     to: '0x171e03485334252291939eF506b144BFC6f68aCE',
    //     value: '19000000000000000',
    // });
    // console.log(res);

    console.log(
      await contract.methods
        .adopt(0)
        .send({ from: "0x3cAcaaECdeEf3627A747398645C2c593e2b770FD" })
    );
  },
} as any;
