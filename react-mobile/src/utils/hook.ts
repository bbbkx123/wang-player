import {useCallback, useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux';

type CallBack<T> = (prev: T | undefined) => void;
type Config = { immediate: boolean };

/**
 * useWatch
 * @param dep 监听对象
 * @param callback
 * @param config 监听设置
 */

function useWatch<T>(
  dep: T,
  callback: CallBack<T>,
  config: Config = { immediate: false },
) {
  // 监听禁止标志
  const stop = useRef<boolean>(false);
  // 初始化标志
  const inited = useRef<boolean>(false);
  const prev = useRef<T>();
  const { immediate } = config;

  useEffect(() => {
    if (!stop.current) {
      const execute = () => callback(prev.current);
      // 防止immediate为false时, 首次加载就执行
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
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps

  return () => {
    stop.current = true;
  };
}

// const useRefCallback = (fn: Function, dependencies: any[]) => {
//   const ref = useRef<any>(fn)
//   // 每次调用的时候，fn 都是一个全新的函数，函数中的变量有自己的作用域
//   // 当依赖改变的时候，传入的 fn 中的依赖值也会更新，这时更新 ref 的指向为新传入的 fn
//   useEffect(() => {
//     ref.current = fn  
//   }, [fn, ...dependencies])

//   return useCallback(() => {
//     const fn = ref.current
//     return fn()
//   }, [ref])
// }


const useAsync = (fetch: Function): any => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const execute = useCallback( async (...args) => {
    setLoading(true)
    setData(null)
    setError(null)
    try {
      const res = await fetch(...args)
      setData(res)
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }, [fetch])
  return {loading, execute, data, error}
}

const useReactiveSelector = (selector: any) => {
  const ref = useRef<any>()
  const prop = useSelector(selector)
  useEffect(() => {
    ref.current = prop
  }, [prop])
  return ref
}

const useTouchEvent = (callback: Function) => {
  const ref = useRef<any>()
  return {
    onTouchStart () {
      ref.current = { date: new Date().getTime() }
    },
    onTouchEnd () {
      if (new Date().getTime() - ref.current.date <= 75) callback && callback(...arguments)
      ref.current = null
    },
  }
}

export { useWatch, useAsync, useReactiveSelector, useTouchEvent };