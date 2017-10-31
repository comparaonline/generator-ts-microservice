# generator-co-microservice [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> This bootstrap a microservice to run on the ComparaOnline infrastructure

## Installation

First, install [Yeoman](http://yeoman.io) and generator-co-microservice using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-co-microservice
```

Then generate your new project:

```bash
yo co-microservice
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).
 
## Troubleshooting

 * If you get: 
 ```
 Error: EACCES: permission denied, open '/Users/currentUser/.config/configstore/insight-yo.json.923972600'
 ```

 Run `sudo chown -R $(whoami) ~/.config`

## License

 © [ComparaOnline]()


[npm-image]: https://badge.fury.io/js/generator-co-microservice.svg
[npm-url]: https://npmjs.org/package/generator-co-microservice
[travis-image]: https://travis-ci.org/comparaonline/generator-co-microservice.svg?branch=master
[travis-url]: https://travis-ci.org/comparaonline/generator-co-microservice
[daviddm-image]: https://david-dm.org/comparaonline/generator-co-microservice.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/comparaonline/generator-co-microservice
