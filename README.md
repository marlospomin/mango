# Mango.js

> A small medium like javascript library to zoom your images.

## Install

``` bash
# Using npm
npm install mango-js

# Using yarn
yarn add mango-js
```

Now include mango and you should be good to go.

``` js
// es6
import mango from 'mango'

// commonjs
const mango = require('mango');
```

Alternatively you can include a minified version of mango (or the source code, up to you) via direct file or using our **CDN** link.

``` html
<body>
  <script src="https://unpkg.com/mango-js"></script>
</body>
```

## Usage

Add ```data-mango``` to your images as it follows below.

``` html
<img data-mango src="path/to/image/image.jpg" alt="">...</img>
```

Add mango ```css``` to your document.

``` html
<link rel="stylesheet" href="/path/to/file/mango.css">
```

Call mango anywhere in your code:

``` js
// Call me
mango();
```

Additionally add a high-res image as a ```data-src``` attribute, like the example below:

``` html
<img data-mango src="" data-src="path/to/image/high.jpg" alt="">...</img>
```

## Configuring

Pass options to mango like the example below:

``` js
// Custom options
mango({
  selector: '[data-mango]', // data-mango
  background: 'white', // background-color
  margin: 50 // 50px
});
```
### Supported parameters

* ```selector``` *type* ```string``` *default* ```[data-mango]```.

* ```background``` *type* ```string``` *default* ```white```.

* ```margin``` *type* ```integer``` *default* ```50```.

* ```interruptKeys``` *type* ```array``` *default* ```[27, 37, 39]```.

## Running Tasks

You can run tasks with ```yarn``` or ```npm``` using the following commands:

``` bash
# Build task
$ yarn build

# etc.
$ ...
```

## Roadmap

### Todo List

* [ ] Make a better example page.
* [x] ~~Add data-src image option~~.
* [ ] Make selected images only support an image tag.
* [ ] Refactor zoom().
* [ ] Refactor event listeners.
* [ ] Refactor handlers
* [ ] Fix isAnimating.
* [x] Refactor animate().
* [ ] Reduce to 150 lines or less (without comments).
* [ ] Refactor to arrow functions.
* [ ] Write tests.

**Legend**: Checked boxes mean *__partial__* completion, checked and ~~crossed~~ items mean they're *__fully__* working.

## Contributing

If you feel like smoothie is missed something please do send a message or, alternatively make a pull request or even open an issue using an appropriate label and we will go from there.

## License

Code released under the [MIT](LICENSE) license.
