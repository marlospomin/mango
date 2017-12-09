# Mango

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
<img data-mango src="http://example.com" alt="">...</img>
```

Call mango anywhere in your code:

``` js
// Call me
mango();
```

## Configuring

**Not available at this time.**

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
* [ ] Add options to the plugin.
* [ ] Refactor mango **hard**.

**Legend**: Checked boxes mean *__partial__* completion, checked and ~~crossed~~ items mean they're *__fully__* working.

## Contributing

If you feel like smoothie is missed something please do send a message or, alternatively make a pull request or even open an issue using an appropriate label and we will go from there.

## License

Code released under the [MIT](LICENSE) license.
