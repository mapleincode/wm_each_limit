# EachLimit
like async.eachLimit.for async/await or promise.

## Install

```bash
npm install vm-each-limit --save
```

## Usage



### 1. eachLimit

```javascript
const { eachLimit } = require('wm-each—limit');

function sleep(time) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const done = async function(item) {
  await sleep(3000);
  return item * 2;
}	

async function main() {
    const items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
    const results = await eachLimit(items, 2, done, { noerror: true, item => console.log(item.msg) });

    console.log(results);
    // should get [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
}

main()
	.catch(err => console.log(err))
```



### 2. each & all & retry

```javascript
const { each, all, retry } = require('wm-each—limit');
const done = async function(item = 1) {
  await sleep(3000);
  return item * 2;
}	

async function eachFunc() {
  const items = [1, 2, 3, 4];
  await each(items, done)
}

async function allFunc() {
  await all([done, done, done]);
}

async function retryFunc() {
  await retry(done, 3);
}

```

