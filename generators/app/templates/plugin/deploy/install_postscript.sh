#!/bin/bash

install_base="/usr/local/easyops"       # Easyops 安装根目录
plugin_name="<%= packageName %>"
install_path="${install_base}/applications/${plugin_name}-A" #多加了个-A后缀，这是我们的部署规范

console="console"                       # console目录应用
scope="@console-plugin"
plugins_dir="${install_base}/${console}/src/www/plugins/"
builtin_plugins_dir="${install_base}/${console}/src/www/builtin-plugins/"

# 删除原有放在buildin-plugins的插件，小产品安装的都统一放在plugins
rm -rf "${builtin_plugins_dir:?}/${scope}/${plugin_name}"
# 删除上一个版本
rm -rf "${plugins_dir:?}/${plugin_name}"

# 确保存在插件目录
mkdir -p "${plugins_dir}"
# 这边转换插件的名字，不用-A后缀
ln -snf "${install_path}" "${plugins_dir}/${plugin_name}"
