

```js
function spawn(genF) {
   return new Promise(function(resolve, reject) {
      const gen = genF();
      function step(nextF) {
         let next;
         try {
            next = nextF();
         } catch(e) {
            return reject(e)
         }
         if(next.done) {
            return resolve(next.value);
         }
         Promise.resolve(next.value).then(function(v) {
            step(function() { return gen.next(v)})
         }, function (error) {
            step(function() { return gen.throw(e)})
         })
      }
      step(function() { return gen.next(undefined)})
   })
}
```
答案来源 [async 函数](https://es6.ruanyifeng.com/#docs/async)