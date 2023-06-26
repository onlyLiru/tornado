export function formatString(str:string) {
    if (str.length <= 8) {
      return str;
    }

    const firstFour = str.substr(0, 4);
    const lastFour = str.substr(str.length - 4, 4);

    return `${firstFour}...${lastFour}`;
}

export function generateRandomNumber(min:number, max:number, decimalPlaces:number) {
    let randomNumber = Math.random() * (max - min) + min;
    let roundedNumber = randomNumber.toFixed(decimalPlaces);
    let paddedNumber = roundedNumber.padEnd(decimalPlaces + 2, '0');
    return parseFloat(paddedNumber);
  }

export function generateRandomString() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  export function generateRandomHex() {
    let characters = '0123456789ABCDEF';
    let randomHex = '0x';
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      randomHex += characters.charAt(randomIndex);
    }
    return randomHex;
  }
