const wrap = method => {
  method.onError = value => wrap((...args) => {
    try { return method(...args); }
    catch (error) { return value; }
  })
  method.onUndefined = value => wrap((...args) => {
    const result = method(...args);
    return result !== undefined ? result : value
  });
  method.if = condition => wrap((...args) =>
    condition(...args) ? method(...args) : args[0]);

  return method;
};
module.exports = { wrap };
