/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { ThemeType } from '@/interfaces/theme';
import { createModel } from 'ice';


export default createModel({
  state: {
    type: 'light',
  } as ThemeType,
  reducers: {
    updateTheme(prevState: ThemeType, payload) {
      prevState.type = payload === 'light' ? 'dark' : 'light';
    },
  },
});
