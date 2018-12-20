const gulp = require("gulp");
const ts = require("gulp-typescript");
const del = require('del');
const tslint = require('gulp-tslint');

const tsProject = ts.createProject("tsconfig.json");
const distDir = "dist";

gulp.task("lint", () => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report({summarizeFailureOutput: true}));
});

gulp.task("build", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(distDir));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.ts", ["build"]);
});

gulp.task("default", ["watch"]);

gulp.task("clean", () => {
  return del(['dist/']);
});
