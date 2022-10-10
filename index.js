/**
 * @Author: maple
 * @Date: 2020-12-04 13:33:31
 * @LastEditors: maple
 * @LastEditTime: 2022-10-10 11:00:07
 */

/**
 * eachLimit
 * @param {Array} items items
 * @param {Number} limit limit at one time
 * @param {function} func Func
 * @param {object} options options
 * @returns Promise<result[]>
 */
const eachLimit = function (items, limit, func, options = {}) {
  return new Promise((resolve, reject) => {
    const noerror = options.noerror || false;
    const out = options.out || (() => {});

    const todoList = [...items];
    const resultList = [];

    const maxTodoCount = todoList.length;
    let todoFinishCount = 0;

    const pendingIndexList = [];
    let doingIndexList = [];

    const checkPending = function () {
      // 判断数组为空
      if ((pendingIndexList.length === 0 && doingIndexList.length === 0)) {
        if (todoFinishCount !== maxTodoCount) {
          reject(new Error(`todoFinishCount 与 maxTodoCount 不符合 ${todoFinishCount} - ${maxTodoCount}`));
        }
        resolve(resultList);
      }

      // 判断完成数
      if (todoFinishCount >= maxTodoCount) {
        reject(new Error(`todoFinishCount 与 maxTodoCount 不符合 ${todoFinishCount} - ${maxTodoCount}`));
      }

      // 获取实际数据的 index
      const index = pendingIndexList.shift();
      if (index === undefined) {
        // todoList 为空
        out({ msg: `doing: ${doingIndexList.join(',')}`, doingIndexList });
        return;
      }

      // 获取实际数据
      const item = todoList[index];

      // 封装 promise
      let promise = func(item);

      if (!promise) {
        throw new Error('promise can\' be empty');
      }

      if (!promise.then) {
        // 可能是返回性的 promise
        promise = promise();
      }

      doingIndexList.push(index);

      if (doingIndexList.length > limit) {
        reject(new Error(`doing index list 大于 limit: ${doingIndexList.length}`));
      }

      out({ msg: `pending: ${pendingIndexList.length}, doing: ${doingIndexList.join(',')}`, doingIndexList });

      promise
        .then((result) => {
          todoFinishCount++;
          out({ msg: `${index} has done.`, doingIndexList, index });
          doingIndexList = doingIndexList.filter(i => i !== index);
          resultList[index] = result;
          checkPending();
        })
        .catch(err => {
          todoFinishCount++;
          out({ msg: `${index} has error.`, doingIndexList, index });
          doingIndexList = doingIndexList.filter(i => i !== index);
          if (!noerror) {
            reject(err);
          } else {
            resultList[index] = { err: err };
            checkPending();
          }
        });
    };

    // 填充 pendingIndex 数组
    for (let i = 0; i < maxTodoCount; i++) {
      pendingIndexList.push(i);
    }

    // 执行操作
    for (let i = 0; i < limit; i++) {
      checkPending();
    }
  });
};

const retry = async function (func, retryTimes = 1) {
  if (retryTimes < 0) {
    retryTimes = 1;
  }

  const errs = [];
  for (let i = 0; i < retryTimes; i++) {
    try {
      return await func();
    } catch (err) {
      errs.push(err);
      if (i === retryTimes - 1) {
        err.errs = errs;
        throw err;
      }
    }
  }
};

const each = async function (items = [], func, options = {}) {
  const noerror = options.noerror || false;
  const result = [];
  for (const item of items) {
    try {
      result.push(await func(item));
    } catch (err) {
      if (!noerror) {
        throw err;
      }
    }
  }

  return result;
};

eachLimit.retry = retry;
eachLimit.all = function (funcs) {
  return Promise.all(funcs.map(func => func()));
};
eachLimit.each = each;
eachLimit.eachLimit = eachLimit;

module.exports = eachLimit;
