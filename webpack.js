const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const MemoryFS = require("memory-fs");
const config = require("./webpack.config");

const watchMode = process.argv.find(arg => arg === "--watch") !== undefined;

const appFolders = fs
  .readdirSync("./src")
  .filter(app => fs.existsSync(`./src/${app}/package.json`));
const configs = appFolders.reduce((configs, app) => {
  const appConfig = config({ app });
  if (appConfig) {
    appConfig.plugins = [
      ...(appConfig.plugins || []),
      new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])
    ];
    configs[app] = appConfig;
  }
  return configs;
}, {});
const apps = Object.keys(configs);

const pkgs = apps.reduce((pkgs, app) => {
  const getEntryDirectory = entry =>
    fs.statSync(configs[app].entry[app]).isDirectory ? entry : path.dirname(entry);
  const pkgSrc = path.join(
    getEntryDirectory(configs[app].entry[app]),
    "package.json"
  );
  pkgs[app] = JSON.parse(fs.readFileSync(pkgSrc));
  return pkgs;
}, {});

const sortedApps = apps.sort((a, b) => {
  if (b in Object.keys(pkgs[a].dependencies || {})) {
    return 1;
  }
  if (a in Object.keys(pkgs[b].dependencies || {})) {
    return -1;
  }
  return 0;
});

const compilers = sortedApps.map(app => webpack(configs[app]));

const watching = {};
function watch(compilers, idx) {
  const app = sortedApps[idx];
  if (watching[app]) {
    watching[app].invalidate();
    return;
  }
  console.log(`---- build (${watchMode ? "watch" : ""}) ${app} ----`);
  const handler = (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        stats.toString({
          colors: true
        })
      );
      if (idx + 1 < compilers.length) {
        watch(compilers, idx + 1);
      }
    }
  };
  if (watchMode) {
    watching[app] = compilers[idx].watch({}, handler);
  } else {
    compilers[idx].run(handler);
  }
}
watch(compilers, 0);
