String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceExtension = function (newExtension) {
  return this.substring(0, this.lastIndexOf('.')) + newExtension;
}
