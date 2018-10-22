'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { execSync } = require('child_process');

describe('generator-console-package:app', () => {
  const packageName = 'just-for-test-' + Math.random().toString(36).substring(7);
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ packageName });
  });

  it('creates files', () => {
    assert.file([
      'packages/' + packageName + '/src/components/' + packageName + '.component.html',
      'packages/' + packageName + '/src/components/' + packageName + '.component.scss',
      'packages/' + packageName + '/src/components/' + packageName + '.component.spec.ts',
      'packages/' + packageName + '/src/components/' + packageName + '.component.ts',
      'packages/' + packageName + '/src/index.module.ts',
      'packages/' + packageName + '/package.json',
      'packages/' + packageName + '/public_api.ts',
      'packages/' + packageName + '/README.md'
    ]);
  });

  afterAll(() => {
    const output = execSync('yarn unlink', {
      cwd: 'packages/' + packageName + '/dist',
      encoding: 'utf8'
    });
    // eslint-disable-next-line
    console.log(output);
  });
});
