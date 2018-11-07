'use strict';
const Generator = require('yeoman-generator');
const { merge, isObject, isString } = require('lodash');
const extendPackage = require('../../helpers/extend-package');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    this.option('keywords', {
      type: String,
      required: false,
      desc: 'Project keywords'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      keywords: this.pkg.keywords,
      private: this.pkg.private
    };

    if (isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (isString(this.pkg.author)) {
      const info = this._parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }

    this.props = merge(this.props, this.options);
  }

  _parseAuthor(author) {
    const pattern = /^\s*([^>]+)\s*<([^>]*)>\s*\(([^)]+)\)\s*$/g;
    const result = pattern.exec(author);
    return {
      name: result[1],
      email: result[2],
      url: result[3]
    };
  }

  prompting() {
    const prompts = [
      {
        name: 'description',
        message: 'Description',
        when: !this.props.description
      },
      {
        name: 'authorName',
        message: "Author's Name",
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      },
      {
        name: 'authorEmail',
        message: "Author's Email",
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      },
      {
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        when: !this.props.keywords,
        filter(words) {
          return words.split(/\s*,\s*/g);
        }
      },
      {
        name: 'private',
        type: 'confirm',
        message: 'Is this package private?',
        when: this.props.private === undefined,
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = merge(this.props, props);
    });
  }

  writing() {
    const keywords = Array.isArray(this.props.keywords) ? this.props.keywords
      : this.props.keywords.split(/\s*,\s*/g);

    extendPackage(this, {
      keywords,
      name: this.options.name,
      version: this.props.version || '1.0.0',
      description: this.props.description,
      main: 'index.js',
      private: this.props.private,
      scripts: {},
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      }
    });
  }
};
