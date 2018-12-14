
/**
 * compute flatten module id from scope and package name
 * @param scope {string} a scope is prefixed by `@`
 * @param packageName {string}
 * @returns {string}
 */
exports.flattenModuleId = function (scope, packageName) {
  const separator = "-";
  if (scope !== undefined) {
    return [scope.substring(1)].concat(packageName.split("/")).join(separator);
  }
  return packageName.split("/").join(separator);
}

/**
 * validate package name
 * @param value {string} input value
 * @returns {boolean}
 */
exports.validatePackageName = function(value) {
  return /^[a-z]+(-[a-z0-9]+)*$/.test(value);
}
