import { createSlice, type Slice, type PayloadAction, type CaseReducer, type CaseReducerActions } from '@reduxjs/toolkit';
import type { UserInfo, UserInfoString } from '../types';

export interface Pocket48LoginInitialState {
  userInfo: UserInfo | null;
}

type SliceReducers = {
  setUserInfo: CaseReducer<Pocket48LoginInitialState, PayloadAction<UserInfo>>;
  setClearInfo: CaseReducer<Pocket48LoginInitialState, PayloadAction>;
}

const sliceName: 'pocket48Login' = 'pocket48Login';
const { actions, reducer }: Slice<Pocket48LoginInitialState, SliceReducers, typeof sliceName> = createSlice({
  name: sliceName,
  initialState(): Pocket48LoginInitialState {
    const userInfoStr: string | null = sessionStorage.getItem('POCKET48_USER_INFO');

    return { userInfo: userInfoStr !== null ? JSON.parse(userInfoStr as UserInfoString) : null };
  },
  reducers: {
    setUserInfo(state: Pocket48LoginInitialState, action: PayloadAction<UserInfo>): void {
      sessionStorage.setItem('POCKET48_USER_INFO', JSON.stringify(action.payload));
      state.userInfo = action.payload;
    },

    setClearInfo(state: Pocket48LoginInitialState, action: PayloadAction): void {
      sessionStorage.removeItem('POCKET48_USER_INFO');
      state.userInfo = null;
    }
  }
});

export const { setUserInfo, setClearInfo }: CaseReducerActions<SliceReducers, typeof sliceName> = actions;
export default { [sliceName]: reducer };