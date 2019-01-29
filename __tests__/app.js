'use strict';
const path = require('path');
const { EventEmitter } = require('events');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { createSandbox } = require('sinon');
const { flattenModuleId, validatePackageName } = require('../generators/app/processor');

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
    assert.jsonFileContent(
      `packages/${packageName}/package.json`,
      {
        name: `@easyops/${packageName}`
      }
    );
    assert.jsonFileContent(
      `packages/${packageName}/package.json`,
      {
        scripts: {
          start: "WATCH_MODE=true node ../../ng-packagr",
          build: "node ../../ng-packagr && rimraf dist/package.json"
        }
      }
    );
  });

  it('should update files', () => {
    assert.jsonFileContent(
      'angular.json',
      {
        projects: {
          [packageName]: {
            root: `packages/${packageName}/src`
          }
        }
      }
    );
    assert.jsonFileContent(
      'tsconfig.json',
      {
        compilerOptions: {
          paths: {
            [`@easyops/${packageName}`]: [
              `packages/${packageName}/public_api.ts`
            ]
          }
        }
      }
    );
  });

  it('should run `lerna exec yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('lerna', ['exec', 'yarn', 'link', `--scope=@easyops/${packageName}`])).toBe(true);

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
      `export class Brick${pascalCaseName}Module`
    );
    assert.jsonFileContent(
      `@brick/${packageName}/package.json`,
      {
        name: `@brick/${packageName}`
      }
    );
    assert.noJsonFileContent(
      `@brick/${packageName}/package.json`,
      {
        scripts: {
          start: "WATCH_MODE=true node ../../ng-packagr"
        }
      }
    );
  });

  it('should update files', () => {
    assert.jsonFileContent(
      'angular.json',
      {
        projects: {
          [`brick-${packageName}`]: {
            root: `@brick/${packageName}/src`
          }
        }
      }
    );
    assert.jsonFileContent(
      'tsconfig.json',
      {
        compilerOptions: {
          paths: {
            [`@brick/${packageName}`]: undefined
          }
        }
      }
    );
  });

  it('should run `lerna exec yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('lerna', ['exec', 'yarn', 'link', `--scope=@brick/${packageName}`])).toBe(true);

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
    assert.jsonFileContent(
      `@plugin-common/${packageName}/package.json`,
      {
        name: `@plugin-common/${packageName}`
      }
    );
    assert.jsonFileContent(
      `@plugin-common/${packageName}/package.json`,
      {
        scripts: {
          start: "WATCH_MODE=true node ../../ng-packagr",
          build: "node ../../ng-packagr && rimraf dist/package.json"
        }
      }
    );
  });

  it('should update files', () => {
    assert.jsonFileContent(
      'angular.json',
      {
        projects: {
          [packageName]: {
            root: `@plugin-common/${packageName}/src`
          }
        }
      }
    );
    assert.jsonFileContent(
      'tsconfig.json',
      {
        compilerOptions: {
          paths: {
            [`@plugin-common/${packageName}`]: undefined
          }
        }
      }
    );
  });

  it('should run `lerna exec yarn link`', () => {
    expect(mockSpawn.calledOnceWithExactly('lerna', ['exec', 'yarn', 'link', `--scope=@plugin-common/${packageName}`])).toBe(true);

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
      `packages/${packageName}/plugins-default.json`,
      `packages/${packageName}/README.md`,
      `packages/${packageName}/tsconfig.json`,
      `packages/${packageName}/.pkgbuild/PKGBUILD`,
      `packages/${packageName}/deploy/install_postscript.sh`,
      `packages/${packageName}/deploy/package.conf.yaml`,
      `packages/${packageName}/deploy/update_postscript.sh`,
      `packages/${packageName}/deploy/update_prescript.sh`,

      // Modified files:
      'angular.json'
    ]);
  });

  it('should create correct files', () => {
    assert.fileContent(
      `packages/${packageName}/src/index.module.ts`,
      `export class ${pascalCaseName}Module`
    );
    assert.jsonFileContent(
      `packages/${packageName}/package.json`,
      {
        name: `@console-plugin/${packageName}`
      }
    );
    assert.fileContent(
      `packages/${packageName}/.pkgbuild/PKGBUILD`,
      `pkgname=${packageName}-A`
    );
    assert.fileContent(
      `packages/${packageName}/deploy/install_postscript.sh`,
      `plugin_name="${packageName}`
    )
  });

  it('should update files', () => {
    assert.jsonFileContent(
      'angular.json',
      {
        projects: {
          [packageName]: {
            root: `packages/${packageName}/src`
          }
        }
      }
    );
    assert.jsonFileContent(
      'tsconfig.json',
      {
        compilerOptions: {
          paths: {
            [`@console-plugin/${packageName}`]: undefined
          }
        }
      }
    );
  });

  it('should run `lerna exec yarn link` and `yarn`', () => {
    expect(mockSpawn.calledWithExactly('lerna', ['exec', 'yarn', 'link', `--scope=@console-plugin/${packageName}`])).toBe(true);

    expect(mockSpawn.calledWithExactly('yarn', [], { cwd: `packages/${packageName}` })).toBe(true);

    expect(mockSpawn.callCount).toBe(2);
  });
});

describe('flattenModuleId', () => {
  const testcases = [
    ['@foo', 'bar', 'foo-bar'],
    [undefined, 'bar/qux', 'bar-qux'],
    ['@foo', 'bar/qux', 'foo-bar-qux']
  ];

  it.each(testcases)("flattenModuleId(%s, %s) should return %s", (scope, packageName, expected) => {
    expect(flattenModuleId(scope, packageName)).toBe(expected);
  });
});

describe('validatePackageName', () => {
  const testcases = [
    ['good-package-name', true],
    ['badPackageName', false]
  ];

  it.each(testcases)("validatePackageName(%s) should return %s", (value, expected) => {
    expect(validatePackageName(value)).toBe(expected);
  });
});
