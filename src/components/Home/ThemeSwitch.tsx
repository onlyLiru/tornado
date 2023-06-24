import { Button, Grid, Space, Image, List, Avatar } from 'antd-mobile';
import MoonLight from '@/assets/moon-light@2x.png';
import MoonDark from '@/assets/moon-dark@2x.png';
import store from '@/store';

export default () => {
  const [themeState, themeDispatchers] = store.useModel('theme');
  const handleSwitch = () => {
    themeDispatchers.updateTheme(themeState.type);
  };


  return (<div>
    <Avatar src={themeState.type === 'light' ? MoonLight : MoonDark} fit="contain" style={{ '--size': '3rem' }} onClick={handleSwitch} />
  </div>);
};