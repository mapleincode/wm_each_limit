/**
 * @Author: maple
 * @Date: 2020-12-04 13:33:31
 * @LastEditors: maple
 * @LastEditTime: 2021-05-14 16:41:25
 */

// async function eachLimit (items, limit, func, options = {}) {
//   const noerror = options.noerror || false;

//   return new Promise(function (resolve, reject) {
//     let startIndex = 0;
//     const maxIndex = items.length;
//     let finishIndex = 0;
//     const results = [];

//     let resultStatus = true;
//     let error = null;

//     const createFuncAndRun = function (status) {
//       if (!resultStatus) {
//         // 结束
//         return;
//       }
//       // if (!status) finishIndex++;

//       if (startIndex < maxIndex) {
//         startIndex++;
//         const item = items[startIndex - 1];
//         beginNewFunc(item);
//       }
//     };

//     const check = function () {
//       if (resultStatus && error & noerror & !noerror) {
//         resultStatus = false;
//         return reject(error);
//       }
//       if (resultStatus && finishIndex >= maxIndex) {
//         resultStatus = false;
//         return resolve(results);
//       }
//     };

//     const beginNewFunc = async function (item) {
//       let result;
//       try {
//         result = await func(item);
//       } catch (err) {
//         error = err;
//       }
//       finishIndex ++;
//       // push result
//       results.push(result);

//       check();

//       createFuncAndRun();
//     };

//     /**
//      * create function run
//      */
//     let _limit = limit;
//     while (_limit > 0) {
//       _limit--;
//       createFuncAndRun(true);
//     }
//   });
// }

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
eachLimit.all = Promise.all;
eachLimit.each = each;

module.exports = eachLimit;
