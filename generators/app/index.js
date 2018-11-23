const fs = require('fs');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

const scopePropsMap = new Map();
scopePropsMap.set('@easyops', {
  repository: 'Console-W',
  subPackagePath: 'packages'
});
scopePropsMap.set('@plugin-common', {
  repository: 'console-plugins',
  subPackagePath: '@plugin-common'
});
const scopes = Array.from(scopePropsMap.keys());

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
          validate: value => /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(value)
        }
      ])
    );
    const { packageName } = this.props;

    // module name
    Object.assign(
      this.props,
      await this.prompt([
        {
          type: 'input',
          name: 'moduleName',
          message: "What's the name of your package's default module?",
          default:
            packageName.replace(/^[a-z]|-[a-zA-Z0-9]/g, match =>
              match.replace('-', '').toUpperCase()
            ) + 'Module'
        }
      ])
    );

    // component name
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

  writing() {
    const srcPath = this.sourceRoot();
    const { packageName, componentName, scope, subPackagePath } = this.props;
    const destPath = subPackagePath + '/' + packageName;
    this.fs.copy(
      srcPath + '/public_api.ts',
      destPath + '/public_api.ts'
    );
    this.fs.copyTpl(
      srcPath + '/dist/package-for-yarn-link.json',
      destPath + '/dist/package.json',
      this.props
    );
    this.fs.copyTpl(
      srcPath + '/package-sample.json',
      destPath + '/package.json',
      this.props
    );
    this.fs.copyTpl(
      srcPath + '/README.md',
      destPath + '/README.md',
      this.props
    );
    this.fs.copyTpl(
      srcPath + '/src/index.module.ts',
      destPath + '/src/index.module.ts',
      this.props
    );
    this.fs.copyTpl(
      srcPath + '/src/components/template.component.html',
      destPath + '/src/components/' + componentName + '.component.html',
      this.props
    );
    this.fs.copy(
      srcPath + '/src/components/template.component.scss',
      destPath + '/src/components/' + componentName + '.component.scss'
    );
    this.fs.copyTpl(
      srcPath + '/src/components/template.component.spec.ts',
      destPath + '/src/components/' + componentName + '.component.spec.ts',
      this.props
    );
    this.fs.copyTpl(
      srcPath + '/src/components/template.component.ts',
      destPath + '/src/components/' + componentName + '.component.ts',
      this.props
    );

    const tsconfigPath = 'tsconfig.json';
    this.fs.copy(tsconfigPath, tsconfigPath, {
      process: content => {
        const tsconfig = JSON.parse(content);
        tsconfig.compilerOptions.paths[`${scope}/${packageName}`] = [`${subPackagePath}/${packageName}`];
        return JSON.stringify(tsconfig, null, '  ') + '\n';
      }
    });

    const angularPath = 'angular.json';
    this.fs.copy(angularPath, angularPath, {
      process: content => {
        const angular = JSON.parse(content);
        angular.projects[packageName] = {
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
    const distPath = this.props.subPackagePath + '/' + this.props.packageName + '/dist';
    const child = this.spawnCommand('yarn', ['link'], { cwd: distPath });
    child.on("close", () => {
      done();
    });
  }
};
