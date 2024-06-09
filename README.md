# Watercolorizer

![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/watercolorizer.png)

**Watercolorizer** is a small graphics library for creating generative watercolor-like shapes from
simple polygonal base shapes.


## Packages

- [`@watercolorizer/watercolorizer`](./libs/watercolorizer/README.md) - Core watercolor polygon distortion library.
- [`@watercolorizer/convolution`](./libs/convolution/README.md) - Simple, unoptimized 1D and 2D convolution functions for typed-arrays.
- [`@watercolorizer/tracer`](./libs/tracer/README.md) - Vector-tracer to convert 1-bit bitmap data to polygonal paths.
- [`@watercolorizer/visvalingam`](./libs/visvalingam/README.md) - Visvalingam–Whyatt algorithm for line simplification.

## Examples

Sketches created with **watercolorizer** and **rough.js**

![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-colonels-bequest.jpg)
![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-codename-iceman.jpg)
![watercolorizer logo](https://j.holmes.codes/images/watercolorizer/example-roger-wilco.jpg)

## Inspiration & Credits

- [Tyler Hobbs](https://www.tylerxhobbs.com/) talk at [Strange Loop Conference 2017](https://www.youtube.com/watch?v=5R9eywArFTE). Most of the core algorithms are implemented using this talk as a basis for the interface.
- Also see the associated blog: [How to Hack a Painting](https://www.tylerxhobbs.com/words/how-to-hack-a-painting) by [Tyler Hobbs](https://www.tylerxhobbs.com/), though the actual talk is perhaps more _illuminating_ at least for me.
- The original _need_ for this library was being inspired by artwork of [Douglas Herring](http://www.douglasherring.com/)
  in the release of [The Colonel's Bequest](https://en.wikipedia.org/wiki/The_Colonel%27s_Bequest) and wanting to create
  generative-art based on those sources.
