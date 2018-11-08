'use strict';
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { execSync } = require('child_process');

describe('generator-console-package:app', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-${random}`;
  const pascalCaseName = `JustForTest${Random}`;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/mock'), dir);
      })
      .withPrompts({ packageName });
  });

  it('should create files', () => {
    assert.file([
      // Created files:
      `packages/${packageName}/src/components/${packageName}.component.html`,
      `packages/${packageName}/src/components/${packageName}.component.scss`,
      `packages/${packageName}/src/components/${packageName}.component.spec.ts`,
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `packages/${packageName}/src/index.module.ts`,
      `packages/${packageName}/package.json`,
      `packages/${packageName}/public_api.ts`,
      `packages/${packageName}/README.md`,

      // Modified files:
      'angular.json',
      'tsconfig.json',
      'webpack/ConfigFactory/angular-packages.json'
    ]);
  });

  it('should create correct files', () => {
    assert.fileContent(
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `selector: "${packageName}"`
    );
    assert.fileContent(
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `templateUrl: "./${packageName}.component.html"`
    );
    assert.fileContent(
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `packages/${packageName}/src/components/${packageName}.component.ts`,
      `export class ${pascalCaseName}Component implements OnInit`
    );
    assert.fileContent(
      `packages/${packageName}/src/index.module.ts`,
      `export class ${pascalCaseName}Module`
    );
    assert.fileContent(
      `packages/${packageName}/package.json`,
      `"name": "@easyops/${packageName}"`
    );
  });

  it('should update files', () => {
    assert.fileContent(
      'angular.json',
      `"${packageName}": {\n      "root": "packages/${packageName}/src"`
    );
    assert.fileContent(
      'tsconfig.json',
      `"@easyops/${packageName}": [\n        "packages/${packageName}"\n      ]`
    );
    assert.fileContent(
      'webpack/ConfigFactory/angular-packages.json',
      `[\n  "packages/console-common",\n  "packages/${packageName}"\n]\n`
    );
  })

  afterAll(() => {
    const output = execSync('yarn unlink', {
      cwd: `packages/${packageName}/dist`,
      encoding: 'utf8'
    });
    // eslint-disable-next-line
    console.log(output);
  });
});
