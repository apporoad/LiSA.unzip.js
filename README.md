# LiSA.unzip.js
easy and light using for yauzl

## just do it

```bash
npm  i --save lisa.unzip.js
```
```js
var unziper = require('lisa.unzip.js')
unziper.unzip('test.zip', 'test2').then(()=>{
    console.log('hello good good day')
})
```