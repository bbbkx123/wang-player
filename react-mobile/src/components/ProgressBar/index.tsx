import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@/store";
import { throttle, useWatch } from "@/utils/tools";
import './index.less'

// 进度条按钮宽度
const progressBarWidth = 16;
// mousedown到mopuseup间隔时间, 用于区分click和mouseup, 超过150ms为mouse事件, 否则为click事件
const refelctTime = 0.1;

const ProgressBar = (props: any) => {
  const { percent } = props;
  const progressBar = useRef<any>(null),
    progress = useRef<any>(null),
    progressBtn = useRef<any>(null);
  const { startTime, dispatch, EventEmitter } = useContext<any>(AppContext);
  const [touch, setTouch] = useState({
    initiated: false,
    startX: 0,
  });
  const [progressClientWidth, setProgressClientWidth] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);

  const progressClick = (e: any) => {
    // 解决mouseup和click重发触发的问题
    let diff = (new Date().getTime() - startTime) / 1000;
    if (diff > refelctTime) return;
    // .getBoundingClientRect()
    const rect = progressBar.current.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left;
    handleOffset(offsetWidth).then(() => {
      EventEmitter.emit("progress-change", getPrecent());
    });
  };

  const handleOffset = (offsetWidth: any) => {
    return new Promise((resolve, reject) => {
      try {
        progress.current.style.width = `${offsetWidth}px`;
        progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
      } catch (err) {
        reject(err);
      }
      // 保证获取更新后的dom
      // this.$nextTick(() => resolve())
    });
  };

  const progressMouseMove = (e: any) => {
    // ?   Math.max(0, this.progressClientWidth + deltaX) -->  0  移动超出左边界
    // ?   Math.max(0, this.progressClientWidth + deltaX) -->  delta  正常移动
    // ?
    // ?   this.barWidth 实际进度条宽度
    // ?   b = Math.max(0, this.progressClientWidth + deltaX)
    // ?   Math.min(a, b)  -->  a 超出右边界
    // ?   Math.min(a, b)  -->  b 正常移动
    if (!touch.initiated) return;
    const deltaX = e.pageX - touch.startX;
    const offsetWidth = Math.min(
      barWidth,
      Math.max(0, progressClientWidth + deltaX)
    );
    handleOffset(offsetWidth).then(() => {
      EventEmitter.emit("progress-changing", getPrecent());
    });
  };

  const progressMouseStart = (e: any) => {
    setTouch({
      initiated: true,
      startX: e.pageX,
    });
    setProgressClientWidth(progress.current.clientWidth);
    dispatch({ type: "startTime", value: new Date().getTime() });
  };

  const _progressMouseMove = (e: any) => {
    throttle(progressMouseMove, 200, 0)([e]);
  };

  const progressMouseEnd = () => {
    // 出现问题: 从$refs获取样式数据会取到更新之前的数据
    // 在move事件上启用节流后, 可以避免使用定时器
    // 先抛出事件, 再将initiated修改为false
    EventEmitter.emit("progress-change", getPrecent());
    setTouch({
      ...touch,
      initiated: false,
    });
  };

  const getPrecent = () => {
    return progress.current.clientWidth / barWidth;
  };

  useEffect(() => {
    setBarWidth(progressBar.current.clientWidth - progressBarWidth);
  }, []);

  // useWatch(percent, (old) => {
  //   // timeupdate事件触发
  //   if (percent > 0 && !touch.initiated && barWidth) {
  //     const offsetWidth = percent * barWidth
  //     handleOffset(offsetWidth)
  //   }
  // })

  useEffect(() => {
    // timeupdate事件触发
    if (percent > 0 && !touch.initiated && barWidth) {
      const offsetWidth = percent * barWidth;
      handleOffset(offsetWidth);
    }
  }, [percent]);

  return (
    <div
      className="progress-bar__container"
      ref={progressBar}
      onClick={progressClick}
    >
      <div
        className="progress-bar"
        onMouseDown={progressMouseStart}
        onMouseMove={_progressMouseMove}
        onMouseUp={progressMouseEnd}
      >
        <div className="progress-bar__background"></div>
        {/* 进度条 */}
        <div className="progress-bar--progress" ref={progress}></div>
        {/* 当前进度按钮 */}
        <div className="progress-bar--btn__wrapper" ref={progressBtn}>
          <div className="progress-bar--btn"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
