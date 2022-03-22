module.exports = function override(config, env) {
  return {
    ...config,
    experiments: {
      topLevelAwait: true
    }
  };
};