import { useContext, useEffect, useRef, useState } from "react";

// import { StoreContext } from "@/store";
// import { throttle } from "@/utils/tools";
import "./index.less";

// 进度条按钮宽度
const progressBarWidth = 16;
// mousedown到mopuseup间隔时间, 用于区分click和mouseup, 超过150ms为mouse事件, 否则为click事件
const refelctTime = 0.1;

// ! 问题: 全面屏手势滑动会进行翻页, 导致touchmove不能正确调用
// ? 测试发现小米手机浏览器存在原生滑动事件, 导致问题, 在微信中可正常使用

// const ProgressBar = (props: any) => {
//   const { percent, progressWidth } = props;
//   const progressBar = useRef<any>(null),
//     progress = useRef<any>(null),
//     progressBtn = useRef<any>(null);
//   const { startTime, dispatch, EventEmitter } = useContext<any>(StoreContext);
//   const [touch, setTouch] = useState({
//     initiated: false,
//     startX: 0,
//   });
//   const [progressClientWidth, setProgressClientWidth] = useState<number>(0);
//   const [barWidth, setBarWidth] = useState<number | null>(null);

//   const progressClick = (e: any) => {
//     // 解决mouseup和click重发触发的问题
//     let diff = (new Date().getTime() - startTime) / 1000;
//     if (diff > refelctTime) return;
//     // .getBoundingClientRect()
//     const rect = progressBar.current.getBoundingClientRect();
//     const offsetWidth = e.touches[0].clientX - rect.left;
//     handleOffset(offsetWidth);
//     EventEmitter.emit("progress-change", getPrecent());
//   };

//   const handleOffset = (offsetWidth: any) => {
//     progress.current.style.width = `${offsetWidth}px`;
//     progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
//   };

//   const progressTouchMove = (e: any) => {
//     // ?   Math.max(0, this.progressClientWidth + deltaX) -->  0  移动超出左边界
//     // ?   Math.max(0, this.progressClientWidth + deltaX) -->  delta  正常移动
//     // ?
//     // ?   this.barWidth 实际进度条宽度
//     // ?   b = Math.max(0, this.progressClientWidth + deltaX)
//     // ?   Math.min(a, b)  -->  a 超出右边界
//     // ?   Math.min(a, b)  -->  b 正常移动

//     if (!touch.initiated) return;
//     const deltaX = e.touches[0].clientX - touch.startX;
//     const offsetWidth = Math.min(
//       barWidth === null ? 0 : barWidth,
//       Math.max(0, progressClientWidth + deltaX)
//     );
//     handleOffset(offsetWidth);
//     EventEmitter.emit("progress-changing", getPrecent());
//   };

//   const progressTouchStart = (e: any) => {
//     setTouch({
//       initiated: true,
//       startX: e.touches[0].clientX,
//     });
//     setProgressClientWidth(progress.current.clientWidth);
//     dispatch({ type: "startTime", value: new Date().getTime() });
//   };

//   // 不进行节流会造成拖动卡顿
//   const _progressTouchMove = (e: any) => {
//     throttle(progressTouchMove, 200, 0)([e]);
//   };

//   const progressTouchEnd = () => {
//     // 出现问题: 从$refs获取样式数据会取到更新之前的数据
//     // 在move事件上启用节流后, 可以避免使用定时器
//     // 先抛出事件, 再将initiated修改为false
//     EventEmitter.emit("progress-change", getPrecent());
//     setTouch({
//       ...touch,
//       initiated: false,
//     });
//   };

//   const getPrecent = () => {
//     let num = progress.current.clientWidth / (barWidth === null ? 0 : barWidth)
//     return num.toFixed(4);
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       if (progressBar.current) {
//         setBarWidth(progressBar.current.clientWidth - progressBarWidth);
//       }
//     }, 0)
//   }, []);

//   useEffect(() => {
//     // timeupdate事件触发
//     if (percent > 0 && !touch.initiated && barWidth !== null) {
//       const offsetWidth = percent * barWidth
//       handleOffset(offsetWidth);
//     }
//   }, [percent]);

//   return (
//     <div
//       className="progress-bar__container"
//       ref={progressBar}
//       onClick={progressClick}
//       style={{width: `${progressWidth}px`}}
//     >
//       <div
//         className="progress-bar"
//         onTouchStart={progressTouchStart}
//         onTouchMove={_progressTouchMove}
//         onTouchEnd={progressTouchEnd}
//       >
//         <div className="progress-bar__background"></div>
//         {/* 进度条 */}
//         <div className="progress-bar--progress" ref={progress}></div>
//         {/* 当前进度按钮 */}
//         <div className="progress-bar--btn__wrapper" ref={progressBtn}>
//           <div className="progress-bar--btn"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

const ProgressBar1 = null

export default ProgressBar1;
