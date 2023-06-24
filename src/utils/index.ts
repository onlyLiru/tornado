export function formatString(str) {
    if (str.length <= 8) {
      return str;
    }

    const firstFour = str.substr(0, 4);
    const lastFour = str.substr(str.length - 4, 4);

    return `${firstFour}...${lastFour}`;
  }