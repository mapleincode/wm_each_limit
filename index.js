/**
 * @Author: maple
 * @Date: 2020-12-04 13:33:31
 * @LastEditors: maple
 * @LastEditTime: 2020-12-04 15:14:54
 */

async function eachLimit (items, limit, func, options = {}) {
  const noerror = options.noerror || false;

  return new Promise(function (resolve, reject) {
    let startIndex = 0;
    const maxIndex = items.length;
    let finishIndex = 0;
    const results = [];

    let resultStatus = true;
    let error = null;

    const createFuncAndRun = function (status) {
      if (!resultStatus) {
        // 结束
        return;
      }
      if (!status) finishIndex++;

      if (startIndex <= maxIndex) {
        startIndex++;
        const item = items[startIndex - 1];
        beginNewFunc(item);
      }
    };

    const check = function () {
      if (resultStatus && error & noerror & !noerror) {
        resultStatus = false;
        return reject(error);
      }
      if (resultStatus && finishIndex >= maxIndex) {
        resultStatus = false;
        return resolve(results);
      }
    };

    const beginNewFunc = async function (item) {
      let result;
      try {
        result = await func(item);
      } catch (err) {
        error = err;
      }
      // push result
      results.push(result);

      check();

      createFuncAndRun();
    };

    /**
     * create function run
     */
    let _limit = limit;
    while (_limit > 0) {
      _limit--;
      createFuncAndRun(true);
    }
  });
}

module.exports = eachLimit;
