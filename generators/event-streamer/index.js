'use strict';
const mkdirp = require('mkdirp');
const _ = require('lodash');
const extend = _.merge;
const yamlHelper = require('../../helpers/yaml-helper');
const fileHelper = require('../../helpers/file-helper');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  static get registerServer() {
    return './event-server';
  }

  static get dependencies() {
    return ['event-streamer'];
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

  writing() {
    this._extendConfig();
    this.extendYaml(
      this.destinationPath('docker-compose.yml'),
      this.templatePath('docker-compose.yml'));

    this.fs.copy(
      this.templatePath('event-server'),
      this.destinationPath('src/event-server')
    );
    this._removeOldVersions();
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
    const config = extend(
      {
        "kafka": {
          "producer": {
            "group.id": this.options.name,
            "metadata.broker.list": "kafka:9092"
          },
          "producerTopic": "kafka_topic",
          "consumer": {
            "group.id": this.options.name,
            "metadata.broker.list": "kafka:9092"
          },
          "consumerTopicConfiguration": {},
          "consumerTopics": [
            "kafka_topic"
          ]
        }
      },
      this.fs.readJSON(this.destinationPath('config/default.json'), {})
    );
    this.fs.writeJSON(this.destinationPath('config/default.json'), config);
  }

  end() {
    this.log(`You might need to create the docker network if it isn't yet created:`)
    this.log('  $ docker network create confluent_kafka')
    this.log('');
    this.log(`If you don't have it installed you can clone the kafka repo here:`)
    this.log('  $ git clone git@github.com:comparaonline/co-kafka.git')
  }
};
