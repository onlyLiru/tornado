import Web3 from "web3";
import sigUtil from "eth-sig-util";
import ethUtil from "ethereumjs-util";

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
        const web3 = new Web3(ethereum);
        (window as any).web3 = web3;

        return {
          web3,
          accounts: accounts,
        };
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  },
  async signTxViaMetaMask() {
    const { web3 } = window as any;
    const msgParams = JSON.stringify({
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1,
        // Give a user-friendly name to the specific contract you're signing for.
        name: "Ether Mail",
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // This identifies the latest version.
        version: "1",
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: "Hello, Bob!",
        attachedMoneyInEth: 4.2,
        from: {
          name: "Cow",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: "Mail",
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        // Refer to primaryType.
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    });

    var from = await web3.eth.getAccounts();

    var params = [from[0], msgParams];
    var method = "eth_signTypedData_v4";

    web3.currentProvider.sendAsync(
      {
        method,
        params,
        from: from[0],
      },
      function (err: any, result: any) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error("ERROR", result);
        console.log("TYPED SIGNED:" + JSON.stringify(result.result));

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(msgParams),
          sig: result.result,
        });

        if (
          ethUtil.toChecksumAddress(recovered) ===
          ethUtil.toChecksumAddress(from)
        ) {
          alert("Successfully recovered signer as " + from);
        } else {
          alert(
            "Failed to verify signer when comparing " + result + " to " + from
          );
        }
      }
    );
  },
  async VisitContract(account: string) {
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
