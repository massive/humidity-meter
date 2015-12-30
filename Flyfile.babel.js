const paths = {
  scripts: ["src/**/*.js"]
}

export default function* () {
  yield this.watch(paths.scripts, "build")
}

export function* text () {
  yield this
    .source("src/**/*.js")
    .babel({ stage: 0 })
    .target("dist/")
}

export function* build () {
  yield this.clear("public/js")
  yield this
    .source(paths.scripts)
    .babel({ presets: ["es2015"], sourceMap: true })
    .concat("chart.js")
    .target("public/js")
}
