import Web3 from 'web3';

export default {
    async MetaMask() {
        const { ethereum } = window as any;
        if (ethereum) {
            try {
              // 请求用户授权
              const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

              // 创建 Web3 实例
              const web3 = new Web3(ethereum);

              // 获取用户的以太坊地址
              const account = accounts[0];

              console.log('Connected account:', account);
              console.log(await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] }));
              return account;
            } catch (error) {
              console.error('Error connecting to wallet:', error);
            }
          } else {
            alert('Please install MetaMask to use this feature.');
          }
    },
};