import {useCallback, useEffect, useRef, useState} from 'react'

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


const useLoading = (fetch: Function): [boolean, Function] => {
  let [loading, setLoading] = useState<boolean>(true)
  const _fetch = useCallback((...args) => {
    return fetch(...args).then((res: any) => {
      setLoading(false)
      return Promise.resolve(res)
    }).catch((err: any) => {
      setLoading(false)
      return Promise.resolve(err)
    })
  }, [fetch])
  return [loading, _fetch]
}


const useReactiveProp = (prop: any) => {
  const ref = useRef<any>(prop)
  useEffect(() => {
    ref.current = prop
  }, [prop])
  return ref
}

export { useWatch, useLoading, useReactiveProp };