'use strict';

import gulp from 'gulp';
import watch from 'gulp-watch';
import batch from 'gulp-batch';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import livereload from 'gulp-livereload';
import data from 'gulp-data';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import image from 'gulp-image';
import gulpFn from 'gulp-fn';
import imageResize from 'gulp-image-resize';
import eventStream from 'event-stream';
import frontMatter from 'front-matter';
import del from 'del';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';
import plumber from 'gulp-plumber';
import {argv as args} from 'yargs'; 
import glob from 'glob';
import slug from 'slug';

const sourceDir = './src';
const contentDir = './src/content';
const destinationDir = (args.env === 'production') ? './dist' : './build';
const idPrefix = '';
let siteData;

function getPageData(pageName){
    let { [pageName]: pageContent } = siteData.pages;
    let data = Object.assign({}, siteData, {content: pageContent});
    return data;
}

gulp.task('data', () => {
    let stream = gulp.src(`${sourceDir}/config.json`)
    .pipe(data((file) => {
        let config = JSON.parse(String(file.contents));
        return config;
    }))
    .pipe(gulpFn((file) => {
        let config = file.data;
        let data = Object.assign({pages: {}}, config);
        let pages =  glob.sync(`${contentDir}/pages/**/page.md`);
        let files = pages;

        files.forEach((file) => {
            let dirName = path.dirname(file).split(contentDir).pop();
            let split = dirName.split('/');
            let source = split.pop();
            let type = split.pop();
            let images = [];
            let sections = [];

            try{
                images = fs.readdirSync(`${contentDir}/${type}/${source}/images/`);
            } catch (err) {}

            try{
                sections = glob.sync(`${contentDir}/${type}/${source}/sections/**/*.md`);
            } catch (err) {}

            try {
                let fileSource = fs.readFileSync(file, 'utf-8');
                let fileContent = frontMatter(fileSource);
                fileContent.attributes.id =  `${idPrefix}${slug(fileContent.attributes.title, {lower:true})}`;

                fileContent.attributes.images = [];
                images.forEach((entry) => {
                    if(path.extname(entry) === ".png" || path.extname(entry) === ".jpg" ){
                        fileContent.attributes.images.push(`./images/${type}/${source}/${entry}`);
                    }
                })

                fileContent.attributes.sections = [];
                sections.forEach((section) => {
                    let sSource = fs.readFileSync(`${section}`, 'utf-8');
                    let sContent = frontMatter(sSource);

                    let sDirPath = path.resolve(section, '..');
                    let sDirName = sDirPath.split('/').pop();
                    let sImageFiles = glob.sync(`${sDirPath}/images/*.*`);
                    let sImages = [];

                    sImageFiles.forEach((image) => {
                        if(path.extname(image) === ".png" || path.extname(image) === ".jpg" || path.extname(image) === ".PNG" || path.extname(image) === ".JPG" ){
                            let fileName = path.basename(image);
                            let imageName = path.basename(image, path.extname(fileName));
                            let imagePath = `images/${type}/${source}/sections/${sDirName}`;

                            if(isNaN(Number(imageName))){
                                sImages.push(`${imagePath}/images/${fileName}`);
                            }else{
                                sImages[Number(imageName)] = `${imagePath}/images/${fileName}`;
                            }
                        }
                    });

                    fileContent.attributes.sections.push({
                        content: sContent,
                        images: sImages,
                        // id: `${idPrefix}${slug(sContent.attributes.title, {lower:true})}`,
                        id: `${idPrefix}${slug(sDirName, {lower:true})}`,
                        type: sContent.attributes.type ? sContent.attributes.type : 'text'
                    });

                })

                let typeData = data[type];
                typeData[source] = fileContent;
            } catch (err) {}
        });

        let siteConfig = fs.readFileSync(`${contentDir}/site.md`, 'utf-8');
        let version = new Date().getTime();
        _.extend(data, {env: args.env, site: frontMatter(siteConfig), version: version});
        siteData = data;  
    }));

    return stream;
});

gulp.task('pages', ['styles'],() => {
    let twig = require('gulp-twig');

    return gulp.src(`${sourceDir}/html/pages/**/*.twig`)
        .pipe(plumber())
    	.pipe(changed(destinationDir))
        .pipe(data((file) => {
            let pageName = path.basename(file.path, '.twig');
            return getPageData(pageName);
        }))
        .pipe(twig({
            base: `${sourceDir}/html/`,
            functions: [
                {
                    name: "styles",
                    func: function (src) {
                        let styleSource = fs.readFileSync(`${destinationDir}/${src}`, 'utf-8');
                        return styleSource;
                    }
                },
                {
                    name: "source",
                    func: function (src) {
                        let styleSource = fs.readFileSync(`${src}`, 'utf-8');
                        return styleSource;
                    }
                }
            ]
        }))
        .pipe(gulp.dest(destinationDir))
        .pipe(livereload({ }));
});

gulp.task('tracks', () => {
    let twig = require('gulp-twig');

    return gulp.src(`${sourceDir}/tracks/*.twig`)
     .pipe(data((file) => {
        return {
            tracks: siteData.pages.vragen.attributes.sections
        }
     }))
     .pipe(twig({
     }))
    .pipe(rename(function (path) {
        path.extname = '.vtt'
        return path;
    }))
    .pipe(gulp.dest(destinationDir))
    .pipe(livereload({ }));
});

gulp.task('compile', ['data', 'pages', 'tracks']);

gulp.task('styles', function () {
    // https://ismamz.github.io/postcss-utilities/docs
	const postcss = require('gulp-postcss');
	const sourcemaps = require('gulp-sourcemaps');
	const cssnano = require('cssnano');
	const utilities = require('postcss-utilities'); 
	const cssnext = require('postcss-cssnext');
    const easyImports = require("postcss-easy-import");
	const processors = [
	    easyImports({glob: true}),
        cssnext({browsers: ['last 2 version']}),
        utilities,
        cssnano
    ];

  	return gulp.src([`${sourceDir}/css/**/[^_]*.css`])
  		.pipe(changed(destinationDir))
  		.pipe(gulpif(args.env == 'development', sourcemaps.init()))
    	.pipe(postcss(processors))
    	.pipe(gulpif(args.env == 'development', sourcemaps.write('/maps')))
    	.pipe(gulp.dest(destinationDir + '/css'))
    	.pipe(livereload({ }));
});

gulp.task('site-images', function () {
    return gulp.src(`${contentDir}/images/**/*.*`)
        .pipe(imageResize({
            width : 1200,
            imageMagick: true
        }))
        .pipe(imagemin({}))
        .pipe(gulp.dest(`${destinationDir}/images`))
});


gulp.task('images', ['site-images']);

gulp.task('public', function () {
  return gulp.src([`${sourceDir}/public/**/*.*`, `${sourceDir}/public/.*`])
        .pipe(changed(destinationDir))
        .pipe(gulp.dest(`${destinationDir}/`))
});


gulp.task('watch', ['data'], () => {
    livereload.listen();
    gulp.watch('./gulpfile.babel.js', ['default']);
    gulp.watch(`${sourceDir}/config.json`, ['default']);  
    
    watch(`${sourceDir}/html/**/*.twig`, batch(function (events, done) {
        gulp.start('compile', done);
    }));

    watch(`${sourceDir}/css/**/*.css`, batch(function (events, done) {
        gulp.start('styles', done);
    }));

    watch(`${sourceDir}/content/**/*.*`, batch(function (events, done) {
        gulp.start('images', 'compile', done);
    }));

    watch(`${sourceDir}/config.json`, batch(function (events, done) {
        gulp.start('default', done);
    }));
});


// https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task('clean', () => {
  return del([
    destinationDir + '/**',
    '!' + destinationDir,
    '!src',
    '!*.*',
  ]);
});


gulp.task('default', ['public', 'images', 'compile']);



/* POSTCSS maybe's

+ https://github.com/maximkoretskiy/postcss-autoreset
+ https://github.com/maximkoretskiy/postcss-initial
+ https://github.com/assetsjs/postcss-assets
+ https://github.com/TrySound/postcss-inline-svg
+ https://github.com/jonathantneal/postcss-write-svg

*/
