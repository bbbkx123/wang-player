import EventEmitter from "events";
import { createContext, useReducer, useRef, useEffect } from "react";

interface storeStateTypes {
  EventEmitter: any;
  startTime: number;
  playListDetail: any;
  currentSongIndex: number | null;
  playStatus: boolean | null;
  duration: number;
  volume: number;
  audioSrc: string | undefined;
}

interface actionType {
  type: string;
  value?: any;
  action?: Function;
}

export const StoreContext = createContext({});

const defaultState: storeStateTypes = {
  EventEmitter: new EventEmitter(),

  startTime: 0,
  playListDetail: null,
  currentSongIndex: null,
  playStatus: null,
  // currentTime: null,
  duration: 0,
  volume: 0,
  audioSrc: undefined,
};

const reducer = (state: storeStateTypes, action: actionType) => {
  let { type, value } = action;
  if (type === "startTime") {
    return Object.assign({}, state, { startTime: value });
  } else if (type === "playListDetail") {
    return Object.assign({}, state, { playListDetail: value });
  } else if (type === "currentSongIndex") {
    return Object.assign({}, state, { currentSongIndex: value });
  } else if (type === "playStatus") {
    return Object.assign({}, state, { playStatus: value });
  } else if (type === "duration") {
    return Object.assign({}, state, { duration: value });
  } else if (type === "volume") {
    return Object.assign({}, state, { volume: value });
  } else if (type === "audioSrc") {
    return Object.assign({}, state, { audioSrc: value });
  }

  return state;
};

export function useThunkReducer() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const _dispatch: any = dispatch;
  const stateRef = useRef<any>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const getState = () => {
    return { ...state };
  };
  const thunkDispatch = (action: any) => {
    typeof action === "function"
      ? action(thunkDispatch, getState) // action(dispatch, getState) 写错了。。。这里应该用thunkDispatch处理，因为之后也可能是个funciton
      : _dispatch(action);
  };
  return [state, thunkDispatch];
}
