const gulp = require("gulp");
const ts = require("gulp-typescript");

const tsProject = ts.createProject("tsconfig.json");
const distDir = "dist";

gulp.task("build", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(distDir));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.ts", ["build"]);
});

gulp.task("default", ["watch"]);
