const path = require("path");

const coreExternals = {
  react: {
    commonjs: "react",
    commonjs2: "react",
    amd: "react",
    root: ["api", "core", "React"]
  },
  "react-dom": {
    commonjs: "react-dom",
    commonjs2: "react-dom",
    amd: "react-dom",
    root: ["api", "core", "ReactDOM"]
  },
  core: {
    commonjs: "core",
    commonjs2: "core",
    amd: "core",
    root: ["api", "core"]
  }
};

function createAppConfig(name) {
  return {
    entry: {
      [name]: `./src/${name}/index.tsx`
    },
    output: {
      path: path.resolve(`./dist/${name}`),
      library: ["api", name],
      libraryTarget: "umd",
      filename: "index.js"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader"
        }
      ]
    }
  };
}

const apps = {
  core: {
    ...createAppConfig("core")
  },
  sub: {
    ...createAppConfig("sub"),
    externals: coreExternals
  }
};

module.exports = function(env) {
  if (env.app) {
    return apps[env.app];
  } else if (env["but-app"]) {
    return Object.keys(apps)
      .filter(app => app !== env["but-app"])
      .map(app => apps[app]);
  } else {
    return Object.keys(apps).map(app => apps[app]);
  }
};
