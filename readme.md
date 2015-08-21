# bare-electron-react-es6

> Bare project for electron with react, es6


## Install dependencies

```
$ npm install
```

### Running application

To run the electron application, This project need to build the source files before running it. `app` task will run `build` script to build the application at `build` directory and then the electron application will be running with the compiled files of the source on `build` directory.

```
$ npm run app
```

### Build

do babel, do trasnpiler, do compile and do copy the source files in the `app`

```
$ npm run build
```

### Package

You need to announce the name of the platform to package and arch also, if You want to build specific platform. If you don't announce the name of the platform? All of platforms and architectures are going to package

```
$ PLATFORM=[darwin|linux|win32|all] ARCH=[all|x64] npm run package
```

## Structure of the project

```
├── index.js
├── app
    ├── components
    │   └── mainview.jsx
    ├── index.css
    └── index.html
```

## License

MIT © [Jimmy Moon](http://ragingwind.me)
