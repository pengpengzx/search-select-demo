// 暂时模拟lodash 深拷贝
export function cloneDeep(obj) {
  try {
    const jsonStr = JSON.stringify(obj);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.log(error);
  }
}