/**
 * @Author: maple
 * @Date: 2020-12-04 13:33:31
 * @LastEditors: maple
 * @LastEditTime: 2021-05-18 15:34:42
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
    const pendingList = [];
    const todoList = [...items];
    const resultList = [];
    let itemI = 0;
    let finishCount = 0 - limit; // reduce init limit count

    const checkPendig = function (done) {
      finishCount++;
      const index = pendingList.indexOf(done);
      const item = todoList.shift();

      const itemIndex = itemI++;
      if (!item && !todoList.length) {
        if (finishCount >= items.length) {
          resolve(resultList);
        }
        return;
      }
      const promise = pendingList[index] = func(item);
      promise
        .then((result) => {
          resultList[itemIndex] = result;
          checkPendig(promise);
        })
        .catch(err => {
          if (!noerror) {
            reject(err);
          }
        });
    };
    for (let i = 0; i < limit; i++) {
      pendingList[i] = i;
      checkPendig(i);
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
