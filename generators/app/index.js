const fs = require('fs');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const { flattenModuleId, validatePackageName } = require('./processor');
const scopesJson = require('./scopes.json');
const pkg = require('../../package.json');

const scopePropsMap = new Map(Object.entries(scopesJson));
const scopes = Array.from(scopePropsMap.keys());
const generatorVersion = pkg.version;

module.exports = class extends Generator {
  initializing() {
    const done = this.async();
    this.log(yosay('Welcome to the Console Package generator!'));
    this.conflicter.force = true;
    fs.readFile('package.json', {
      encoding: 'utf8'
    }, (err, content) => {
      if (err) {
        this.log('Warning: can\'t find package.json in current directory');
      } else {
        switch (JSON.parse(content).name) {
          case 'easyops-web-console':
            this.defaultScopeIndex = 0;
            break;
          case 'console-plugins':
            this.defaultScopeIndex = 1;
            break;
          default:
            this.log('Warning: current directory seems incorrect');
        }
      }
      done();
    });
  }

  async prompting() {
    // scope
    this.props = await this.prompt([
      {
        type: 'list',
        name: 'scope',
        message: "What's the scope of your package?",
        choices: scopes,
        default: this.defaultScopeIndex
      }
    ]);
    const { scope } = this.props;

    // repository
    Object.assign(this.props, scopePropsMap.get(scope));

    // package name
    Object.assign(
      this.props,
      await this.prompt([
        {
          type: 'input',
          name: 'packageName',
          message: "What's the name of your package (in kebab-case)?",
          validate: validatePackageName
        }
      ])
    );
    const { packageName, moduleNamePrefix, type } = this.props;

    // generate flat module id
    // For design, @see https://github.com/ng-packagr/ng-packagr/blob/v4.4.1/docs/DESIGN.md#tools-and-implementation-details
    // For implementation, @see https://github.com/ng-packagr/ng-packagr/blob/v4.4.1/src/lib/ng-package-format/entry-point.ts#L157
    Object.assign(this.props, {
      flattenModuleId: flattenModuleId(scope, packageName)
    });

    // module name
    Object.assign(
      this.props,
      await this.prompt([
        {
          type: 'input',
          name: 'moduleName',
          message: "What's the name of your package's default module?",
          default:
            (moduleNamePrefix === undefined ? '' : moduleNamePrefix) +
            packageName.replace(/^[a-z]|-[a-zA-Z0-9]/g, match =>
              match.replace('-', '').toUpperCase()
            ) + 'Module'
        }
      ])
    );

    // component name
    if (type === 'library' || type === 'brick') {
      Object.assign(
        this.props,
        await this.prompt([
          {
            type: 'input',
            name: 'componentName',
            message: "What's the name of your component?",
            default: packageName
          }
        ])
      );
      const { componentName } = this.props;
      this.props.componentClassName = componentName.replace(/^[a-z]|-[a-zA-Z0-9]/g, match =>
        match.replace('-', '').toUpperCase()
      ) + 'Component';
    }
  }

  writing() {
    const { packageName, componentName, scope, subPackagePath, type, projectNamePrefix, tsconfigPath } = this.props;
    const destRoot = this.destinationRoot();
    const destPath = `${destRoot}/${subPackagePath}/${packageName}`;
    const srcPath = `${this.sourceRoot()}/${type}`;

    let srcPairs, tplPairs;

    if (type === 'library') {
      srcPairs = {
        'public_api.ts': 'public_api.ts'
      };

      tplPairs = {
        'package.json.ejs': 'package.json',
        'README.md': 'README.md',
        'src/index.module.ts': 'src/index.module.ts',
        ...['html', 'scss', 'spec.ts', 'ts'].reduce((acc, ext) => {
          acc[`src/components/template.component.${ext}`] = `src/components/${componentName}.component.${ext}`;
          return acc;
        }, {})
      }
    } else if (type === 'plugin') {
      srcPairs = {
        'deploy/update_postscript.sh': 'deploy/update_postscript.sh',
        'deploy/update_prescript.sh': 'deploy/update_prescript.sh',
        'plugins-default.json': 'plugins-default.json',
        'tsconfig.json': 'tsconfig.json',
        'src/pages/index/index.component.html': 'src/pages/index/index.component.html',
        'src/pages/index/index.component.scss': 'src/pages/index/index.component.scss',
        'src/pages/index/index.component.spec.ts': 'src/pages/index/index.component.spec.ts',
        'src/pages/index/index.component.ts': 'src/pages/index/index.component.ts',
      };

      tplPairs = {
        '.pkgbuild/PKGBUILD': '.pkgbuild/PKGBUILD',
        'deploy/install_postscript.sh': 'deploy/install_postscript.sh',
        'deploy/package.conf.yaml': 'deploy/package.conf.yaml',
        'package-sample.json': 'package.json',
        'README.md': 'README.md',
        'src/index.module.ts': 'src/index.module.ts',
        'src/index.states.ts': 'src/index.states.ts',
        'src/main.ts': 'src/main.ts',
      }
    } else {
      // type === 'brick'
      srcPairs = {
        'deploy/update_postscript.sh': 'deploy/update_postscript.sh',
        'deploy/update_prescript.sh': 'deploy/update_prescript.sh',
        'tsconfig.json': 'tsconfig.json'
      };

      tplPairs = {
        '.pkgbuild/PKGBUILD': '.pkgbuild/PKGBUILD',
        'deploy/install_postscript.sh': 'deploy/install_postscript.sh',
        'deploy/package.conf.yaml': 'deploy/package.conf.yaml',
        'package-sample.json': 'package.json',
        'README.md': 'README.md',
        'src/index.module.ts': 'src/index.module.ts',
        'src/main.ts': 'src/main.ts',
        ...['html', 'scss', 'spec.ts', 'ts'].reduce((acc, ext) => {
          acc[`src/components/template.component.${ext}`] = `src/components/${componentName}.component.${ext}`;
          return acc;
        }, {})
      }
    }

    Object.entries(srcPairs).forEach(([from, to]) => {
      this.fs.copy(`${srcPath}/${from}`, `${destPath}/${to}`);
    });

    Object.entries(tplPairs).forEach(([from, to]) => {
      this.fs.copyTpl(`${srcPath}/${from}`, `${destPath}/${to}`, {
        ...this.props,
        generatorVersion
      });
    });

    if (tsconfigPath) {
      const tsconfigJson = 'tsconfig.json';
      this.fs.copy(`${this.destinationRoot()}/${tsconfigJson}`, `${destRoot}/${tsconfigJson}`, {
        process: content => {
          const tsconfig = JSON.parse(content);
          tsconfig.compilerOptions.paths[`${scope}/${packageName}`] = [`${subPackagePath}/${packageName}/public_api.ts`];
          return JSON.stringify(tsconfig, null, '  ') + '\n';
        }
      });
    }

    const angularPath = 'angular.json';
    const projectName = (projectNamePrefix === undefined ? '' : projectNamePrefix) + packageName;
    this.fs.copy(`${this.destinationRoot()}/${angularPath}`, `${destRoot}/${angularPath}`, {
      process: content => {
        const angular = JSON.parse(content);
        angular.projects[projectName] = {
          "root": `${subPackagePath}/${packageName}/src`,
          "projectType": "application",
          "schematics": {
            "@schematics/angular:component": {
              "path": `${subPackagePath}/${packageName}/src`,
              "styleext": "scss"
            },
            "@schematics/angular:directive": {
              "path": `${subPackagePath}/${packageName}/src`
            },
            "@schematics/angular:module": {
              "path": `${subPackagePath}/${packageName}/src`
            },
            "@schematics/angular:service":{
              "path": `${subPackagePath}/${packageName}/src`
            },
            "@schematics/angular:pipe": {
              "path": `${subPackagePath}/${packageName}/src`
            },
            "@schematics/angular:class": {
              "path": `${subPackagePath}/${packageName}/src`,
              "spec": true
            }
          }
        };
        return JSON.stringify(angular, null, '  ') + '\n';
      }
    });
  }

  install() {
    const done = this.async();
    const { scope, packageName } = this.props;
    const childOfYarnLink = this.spawnCommand('lerna', ['exec', 'yarn', 'link', `--scope=${scope}/${packageName}`]);
    childOfYarnLink.on("close", () => {
      done();
    });
  }
};
