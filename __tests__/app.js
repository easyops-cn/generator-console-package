'use strict';
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-console-package:app:@easyops', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-${random}`;
  const pascalCaseName = `JustForTest${Random}`;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
      })
      .withPrompts({
        scope: '@easyops',
        packageName
      });
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
      'tsconfig.json'
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
  })
});

describe('generator-console-package:app:@plugin-common', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-2-${random}`;
  const pascalCaseName = `JustForTest2${Random}`;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
      })
      .withPrompts({
        scope: '@plugin-common',
        packageName
      });
  });

  it('should create files', () => {
    assert.file([
      // Created files:
      `@plugin-common/${packageName}/src/components/${packageName}.component.html`,
      `@plugin-common/${packageName}/src/components/${packageName}.component.scss`,
      `@plugin-common/${packageName}/src/components/${packageName}.component.spec.ts`,
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `@plugin-common/${packageName}/src/index.module.ts`,
      `@plugin-common/${packageName}/package.json`,
      `@plugin-common/${packageName}/public_api.ts`,
      `@plugin-common/${packageName}/README.md`,

      // Modified files:
      'angular.json',
      'tsconfig.json'
    ]);
  });

  it('should create correct files', () => {
    assert.fileContent(
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `selector: "${packageName}"`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `templateUrl: "./${packageName}.component.html"`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/src/components/${packageName}.component.ts`,
      `export class ${pascalCaseName}Component implements OnInit`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/src/index.module.ts`,
      `export class ${pascalCaseName}Module`
    );
    assert.fileContent(
      `@plugin-common/${packageName}/package.json`,
      `"name": "@plugin-common/${packageName}"`
    );
  });

  it('should update files', () => {
    assert.fileContent(
      'angular.json',
      `"${packageName}": {\n      "root": "@plugin-common/${packageName}/src"`
    );
    assert.fileContent(
      'tsconfig.json',
      `"@plugin-common/${packageName}": [\n        "@plugin-common/${packageName}"\n      ]`
    );
  })
});

describe('generator-console-package:app:@console-plugin', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-3-${random}`;
  const pascalCaseName = `JustForTest3${Random}`;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
      })
      .withPrompts({
        scope: '@console-plugin',
        packageName
      });
  });

  it('should create files', () => {
    assert.file([
      // Created files:
      `packages/${packageName}/src/pages/index/index.component.html`,
      `packages/${packageName}/src/pages/index/index.component.scss`,
      `packages/${packageName}/src/pages/index/index.component.spec.ts`,
      `packages/${packageName}/src/pages/index/index.component.ts`,
      `packages/${packageName}/src/index.module.ts`,
      `packages/${packageName}/src/index.states.ts`,
      `packages/${packageName}/package.json`,
      `packages/${packageName}/README.md`,
      `packages/${packageName}/tsconfig.json`,

      // Modified files:
      'angular.json'
    ]);
  });

  it('should create correct files', () => {
    assert.fileContent(
      `packages/${packageName}/src/index.module.ts`,
      `export class ${pascalCaseName}Module`
    );
    assert.fileContent(
      `packages/${packageName}/package.json`,
      `"name": "@console-plugin/${packageName}"`
    );
  });

  it('should update files', () => {
    assert.fileContent(
      'angular.json',
      `"${packageName}": {\n      "root": "packages/${packageName}/src"`
    );
  });
});
