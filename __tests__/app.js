'use strict';
const path = require('path');
const { EventEmitter } = require('events');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { createSandbox } = require('sinon');

const sandbox = createSandbox();

describe('generator-console-package:app:@easyops', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-${random}`;
  const pascalCaseName = `JustForTest${Random}`;
  let mockSpawn;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
        fs.writeJsonSync(path.resolve(dir, './package.json'), { name: 'easyops-web-console' });
      })
      .on('ready', gen => {
        mockSpawn = sandbox.stub(gen, 'spawnCommand').callsFake(() => {
          const spawnEvent = new EventEmitter();
          process.nextTick(() => {
            spawnEvent.emit('close');
          });
          return spawnEvent;
        });
      })
      .withPrompts({
        scope: '@easyops',
        packageName
      });
  });

  afterAll(() => {
    sandbox.restore();
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
  });

  it('should run `yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('yarn', ['link'], {
      cwd: `packages/${packageName}/dist`
    })).toBe(true);

    expect(mockSpawn.callCount).toBe(1);
  });
});

describe('generator-console-package:app:@brick', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-brick-${random}`;
  const pascalCaseName = `JustForTestBrick${Random}`;
  let mockSpawn;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
        fs.writeJsonSync(path.resolve(dir, './package.json'), { name: 'unknown' });
      })
      .on('ready', gen => {
        mockSpawn = sandbox.stub(gen, 'spawnCommand').callsFake(() => {
          const spawnEvent = new EventEmitter();
          process.nextTick(() => {
            spawnEvent.emit('close');
          });
          return spawnEvent;
        });
      })
      .withPrompts({
        scope: '@brick',
        packageName
      });
  });

  afterAll(() => {
    sandbox.restore();
  });

  it('should create files', () => {
    assert.file([
      // Created files:
      `@brick/${packageName}/src/components/${packageName}.component.html`,
      `@brick/${packageName}/src/components/${packageName}.component.scss`,
      `@brick/${packageName}/src/components/${packageName}.component.spec.ts`,
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `@brick/${packageName}/src/index.module.ts`,
      `@brick/${packageName}/package.json`,
      `@brick/${packageName}/public_api.ts`,
      `@brick/${packageName}/README.md`,

      // Modified files:
      'angular.json',
      'tsconfig.json'
    ]);
  });

  it('should create correct files', () => {
    assert.fileContent(
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `selector: "${packageName}"`
    );
    assert.fileContent(
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `templateUrl: "./${packageName}.component.html"`
    );
    assert.fileContent(
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `styleUrls: ["./${packageName}.component.scss"]`
    );
    assert.fileContent(
      `@brick/${packageName}/src/components/${packageName}.component.ts`,
      `export class ${pascalCaseName}Component implements OnInit`
    );
    assert.fileContent(
      `@brick/${packageName}/src/index.module.ts`,
      `export class ${pascalCaseName}Module`
    );
    assert.fileContent(
      `@brick/${packageName}/package.json`,
      `"name": "@brick/${packageName}"`
    );
  });

  it('should update files', () => {
    assert.fileContent(
      'angular.json',
      `"${packageName}": {\n      "root": "@brick/${packageName}/src"`
    );
    assert.fileContent(
      'tsconfig.json',
      `"@brick/${packageName}": [\n        "@brick/${packageName}"\n      ]`
    );
  });

  it('should run `yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('yarn', ['link'], {
      cwd: `@brick/${packageName}/dist`
    })).toBe(true);

    expect(mockSpawn.callCount).toBe(1);
  });
});

describe('generator-console-package:app:@plugin-common', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-common-${random}`;
  const pascalCaseName = `JustForTestCommon${Random}`;
  let mockSpawn;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
        fs.writeJsonSync(path.resolve(dir, './package.json'), { name: 'console-plugins' });
      })
      .on('ready', gen => {
        mockSpawn = sandbox.stub(gen, 'spawnCommand').callsFake(() => {
          const spawnEvent = new EventEmitter();
          process.nextTick(() => {
            spawnEvent.emit('close');
          });
          return spawnEvent;
        });
      })
      .withPrompts({
        scope: '@plugin-common',
        packageName
      });
  });

  afterAll(() => {
    sandbox.restore();
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
  });

  it('should run `yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('yarn', ['link'], {
      cwd: `@plugin-common/${packageName}/dist`
    })).toBe(true);

    expect(mockSpawn.callCount).toBe(1);
  });
});

describe('generator-console-package:app:@console-plugin', () => {
  const random = Math.random().toString(36).substring(7);
  const Random = random.substr(0, 1).toUpperCase() + random.substr(1);
  const packageName = `just-for-test-plugin-${random}`;
  const pascalCaseName = `JustForTestPlugin${Random}`;
  let mockSpawn;

  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        fs.copySync(path.join(__dirname, '../generators/app/templates/library/mock'), dir);
      })
      .on('ready', gen => {
        mockSpawn = sandbox.stub(gen, 'spawnCommand').callsFake(() => {
          const spawnEvent = new EventEmitter();
          process.nextTick(() => {
            spawnEvent.emit('close');
          });
          return spawnEvent;
        });
      })
      .withPrompts({
        scope: '@console-plugin',
        packageName
      });
  });

  afterAll(() => {
    sandbox.restore();
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

  it('should run `yarn link` and `yarn`', () => {
    expect(mockSpawn.calledWithExactly('yarn', ['link'], {
      cwd: `packages/${packageName}`
    })).toBe(true);

    expect(mockSpawn.calledWithExactly('yarn', [], {
      cwd: `packages/${packageName}`
    })).toBe(true);

    expect(mockSpawn.callCount).toBe(2);
  });
});
