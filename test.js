/**
 * @Author: maple
 * @Date: 2021-05-14 16:07:00
 * @LastEditors: maple
 * @LastEditTime: 2022-10-10 11:02:33
 */
const { eachLimit } = require('./index');
function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
const items = [];
for (let i = 1; i <= 100; i++) {
  items.push(i);
}

eachLimit(items, 10, async function (x) {
  await sleep(Math.random() * 1000);
  console.log('finish: ' + x);
  return x * x;
}, { out: x => console.log(x.msg) })
  .then(result => console.log(result));
