import { createStore } from 'ice';
import user from '@/models/user';
import theme from '@/models/theme';
import deposit from '@/models/deposit';

export default createStore({
  user,
  theme,
  deposit,
});
