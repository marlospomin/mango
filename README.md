# Mango

> A small medium-like javascript library to zoom your images.

## Demo

Feel free to check the demo on CodePen [here](https://codepen.io/marlospomin/full/YzyexoX).

## Install

```bash
# Using npm
npm install @marlospomin/mango

# Using yarn
yarn add @marlospomin/mango
```

Now include mango and you should be good to go.

```js
// es6
import mango from '@marlospomin/mango'

// commonjs
const mango = require('@marlospomin/mango')
```

## Usage

Add ```data-mango``` to your images as it follows below.

```html
<img data-mango src="path/to/image/image.jpg" alt="">...</img>
```

Add mango **required** ```css``` to your document/styles.

```css
.mango-overlay {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
  transition: opacity 0.2s ease;
}

.mango-image--open {
  position: relative;
  cursor: zoom-out !important;
}

.mango--open .mango-overlay {
  cursor: zoom-out;
  opacity: 1;
}

.mango-image {
  cursor: zoom-in;
  transition: transform 0.2s ease;
}
```

Call mango anywhere in your code:

```js
// Call me
mango()
```

Additionally add a high-res image as a ```data-src``` attribute, like the example below:

```html
<img data-mango src="" data-src="path/to/image/high.jpg" alt="">...</img>
```

## Configuring

Pass options to mango like the example below:

```js
// Custom options
mango({
  selector: '[data-mango]',
  background: 'white',
  margin: 50
})
```

### Supported parameters

* ```selector``` *type* ```string``` *default* ```[data-mango]```.

* ```background``` *type* ```string``` *default* ```white```.

* ```margin``` *type* ```integer``` *default* ```50```.

* ```interruptKeys``` *type* ```array``` *default* ```[27, 37, 39]```.

## Running Tasks

You can run tasks with ```yarn``` command like the example below:

```bash
# Build task
$ yarn build

# Lint task
$ yarn lint
```

## Contributing

Create a pull request or open an issue and we will go from there.

## License

Code released under the [MIT](LICENSE) license.
