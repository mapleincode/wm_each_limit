/**
 * @Author: maple
 * @Date: 2021-05-14 16:07:00
 * @LastEditors: maple
 * @LastEditTime: 2021-05-14 16:36:34
 */
const { eachLimit } = require('./index');
function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
const items = [];
for (let i = 1; i < 1000; i++) {
  items.push(i);
}

eachLimit(items, 10, async function (x) {
  await sleep(Math.random() * 1000);
  console.log('finish: ' + x);
  return x * 2;
})
  .then(result => console.log(result));
