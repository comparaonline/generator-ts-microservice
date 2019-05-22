'use strict';
const mkdirp = require('mkdirp');
const { merge } = require('lodash');
const jsonExtend = require('../../helpers/json-extend');
const yamlHelper = require('../../helpers/yaml-helper');
const fileHelper = require('../../helpers/file-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get registerServer() {
    return './event-server';
  }

  static get dependencies() {
    return ['@comparaonline/event-streamer@^1.0.1'];
  }

  constructor(args, options) {
    super(args, options);
    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    yamlHelper(this);
    fileHelper(this);
  }

  prompting() {
    const def = { rdConfig: { } };
    const config = this.fs.readJSON(
      this.destinationPath('config/production.json'),
      {}
    ) || {};
    const prompts = [
      {
        name: 'username',
        message: 'Production Kafka Username (or Key)',
        default: ((config || {}).rdConfig || {})['sasl.username'],
        store: true
      },
      {
        name: 'password',
        message: 'Production Kafka Password (or Secret Key)',
        default: ((config || {}).rdConfig || {})['sasl.password'],
        store: true
      },
      {
        name: 'broker',
        message: 'Production Kafka Broker (host:port)',
        default: (config || {}).broker,
        store: true
      }
    ];
  return this.prompt(prompts).then(props => {
      this.props = merge(this.props, props);
    });
  }

  writing() {
    this._extendConfig();
    this.extendYaml(
      this.destinationPath('docker-compose.yml'),
      this.templatePath('docker-compose.yml')
    );

    mkdirp.sync('src/event-server/actions/__tests__');
    mkdirp.sync('src/event-server/events');
    this.fs.copy(
      this.templatePath('event-server/actions/ping-action.ts'),
      this.destinationPath('src/event-server/actions/ping-action.ts')
    );
    this.fs.copy(
      this.templatePath('event-server/events/ping-events.ts'),
      this.destinationPath('src/event-server/events/ping-events.ts')
    );
    this.fs.copy(
      this.templatePath('event-server/index.ts'),
      this.destinationPath('src/event-server/index.ts')
    );
    this.fs.copy(
      this.templatePath('event-server/router.ts'),
      this.destinationPath('src/event-server/router.ts')
    );
    try {
      this.fs.copy(
        this.templatePath(`event-server/actions/__tests__/ping-action.${this._testFramework()}.ts`),
        this.destinationPath('src/event-server/actions/__tests__/ping-action.test.ts')
      );
    } catch (e) {
      this.log.error(`Error!!! ${e.message}`);
    }
    this._removeOldVersions();
  }

  _testInitialization() {
    const additionalParts = [];
    if (this._hasDependency('sequelize')) {
      mkdirp.sync(this.destinationPath('src/test-helpers'));
      this.fs.copy(
        this.templatePath('sequelize.ts'),
        this.destinationPath('src/test-helpers/sequelize.ts')
      );
    } else if (this._hasDependency('typeorm')) {
      mkdirp.sync(this.destinationPath('src/test-helpers'));
      this.fs.copy(
        this.templatePath('typeorm.ts'),
        this.destinationPath('src/test-helpers/typeorm.ts')
      );
    }
    return additionalParts.join('\n')
  }

  _testFramework() {
    if (this.options.hasDependency('mocha')) {
      return 'mocha';
    } else if (this.options.hasDependency('jest')) {
      return 'jest';
    } else {
      throw new Error('No test framework defined');
    }
  }

  _removeOldVersions() {
    const oldFiles = [
      'src/event-server/events/pong.ts',
      'src/event-server/events/ping.ts'
    ]
    oldFiles.forEach(file => {
      if (this.fs.exists(this.destinationPath(file))) {
        this.fs.delete(this.destinationPath(file));
      }
    });
  }

  _yamlOrder(a, b) {
    const max = 10000;
    const order = {
      version: 1,
      services: 2,
      build: 3,
      image: 3,
      volumes: max
    };
    const valueOf = name => order[name] || max - 1;
    return valueOf(a) - valueOf(b) || a.localeCompare(b);
  }

  _extendConfig() {
    const extend = jsonExtend(this);
    extend('config/default.json', 'config/default.json', {
      kafka: { groupId: this.options.name }
    });
    extend('config/production.json', 'config/production.json', {
      kafka: {
        broker: this.props.broker,
        rdConfig: {
          "sasl.username": this.props.username,
          "sasl.password": this.props.password
        }
       }
    });
  }

  end() {
    this.log(`You might need to create the docker network if it isn't yet created:`)
    this.log('  $ docker network create confluent_kafka')
    this.log('');
    this.log(`If you don't have it installed you can clone the kafka repo here:`)
    this.log('  $ git clone git@github.com:comparaonline/co-kafka.git')
  }
};
