function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function validate(input) {
  const regex = /^([a-z]+)+$/;
  return regex.test(input);
}

function setUserRole(obj, path, value) {
  const keys = path.split('.');
  keys.reduce((acc, key, i) => {
    if (i === keys.length - 1) acc[key] = value;
    return acc[key];
  }, obj);
}
