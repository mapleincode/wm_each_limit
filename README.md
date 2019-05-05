# EachLimit
async/await each limit

## Usage

```javascript
const eachLimit = require('wm-each—limit');

function sleep(time) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function done() {
    const items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const results = await eachLimit(items, 2, async function(item) {
        await sleep(3000);
        console.log(item);
        return item;
    });

    console.log(results);
}

done();
```