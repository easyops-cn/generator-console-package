const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  initializing() {
    this.log(yosay('Welcome to the Console Package generator!'));
  }

  async prompting() {
    this.props = await this.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: "What's the name of your package (in kebab-case)?"
      }
    ]);
    const { packageName } = this.props;
    Object.assign(
      this.props,
      await this.prompt([
        {
          type: 'input',
          name: 'moduleName',
          message: "What's the name of your package's default module?",
          default:
            packageName.replace(/^[a-z]|-[a-z]/g, match =>
              match.replace('-', '').toUpperCase()
            ) + 'Module'
        }
      ])
    );
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
    this.props.componentClassName = componentName.replace(/^[a-z]|-[a-z]/g, match =>
      match.replace('-', '').toUpperCase()
    ) + 'Component';
  }

  writing() {
    const srcPath = this.sourceRoot();
    const { packageName, componentName } = this.props;
    const destPath = 'packages/' + packageName;
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
  }

  install() {
    const done = this.async();
    const distPath = 'packages/' + this.props.packageName + '/dist';
    const child = this.spawnCommand('yarn', ['link'], { cwd: distPath });
    child.on("close", () => {
      done();
    });
  }
};
