function feature() { return 'T1a-linear'; }
module.exports = { feature };

function featureV2() {
  return 'second-commit-content';
}
module.exports.featureV2 = featureV2;

function featureV3() { return 'third-commit'; }
module.exports.featureV3 = featureV3;
