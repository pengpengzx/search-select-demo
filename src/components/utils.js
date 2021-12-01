// 暂时模拟lodash 深拷贝
export function cloneDeep(obj) {
  try {
    const jsonStr = JSON.stringify(obj);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.log(error);
  }
}

// 节流函数
export function throttle(fn, delay) {
  let _this = this;
  return function () {
    const args = arguments;
    if (_this.timer)  {
      clearTimeout(_this.timer)
    }
    _this.timer = setTimeout(function () {
      fn.apply(_this, args);
    }, delay);
  };
}
