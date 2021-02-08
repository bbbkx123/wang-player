import {useEffect, useRef} from 'react'

/**
 * 节流
 * @param {Function} fn 目标函数 
 * @param {Number} wait 间隔时间
 * @param {Number} type 模式  0 ---> timestamp , 1 ---> timeout
 */
export function throttle (fn: any, wait: any, type: any) {
  const context = this
  return function (_arguments: any[]) {
    if (type === 0) {
      let newTimestamp = new Date().getTime()
      if (!fn._timestamp) fn._timestamp = 0
      if (newTimestamp - fn._timestamp > wait) {
        fn.call(context, ..._arguments)
        fn._timestamp = newTimestamp
      }
    } else {
      if (!fn._timeout) {
        fn._timeout = setTimeout(() => {
          fn.call(context, ..._arguments)
          fn._timeout = null
          clearTimeout(fn._timeout)
        }, wait)
      }
    }
  }
}

// https://juejin.cn/post/6844904078653276167#comment
type Callback<T> = (prev: T | undefined) => void;
type Config = {
  immediate: boolean;
};

export function useWatch<T>(dep: T, callback: Callback<T>, config: Config = { immediate: false }) {
  const { immediate } = config;

  const prev = useRef<T>();
  const inited = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    const execute = () => callback(prev.current);

    if (!stop.current) {
      if (!inited.current) {
        inited.current = true;
        if (immediate) {
          execute();
        }
      } else {
        execute();
      }
      prev.current = dep;
    }
  }, [dep]);

  return () => {
    stop.current = true;
  };
}
