/**
 * reference: https://t-cr.jp/article/fe164849a4e6835d
 */

const imgmin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const glob = require('glob');

const baseDir = './src/images';
const dirJpg = glob.sync(`${baseDir}/**/*.{jpeg,jpg}`);
const dirPng = glob.sync(`${baseDir}/**/*.png`);
const dirGif = glob.sync(`${baseDir}/**/*.gif`);
const dirSvg = glob.sync(`${baseDir}/**/*.svg`);

const outputFunc = (type, tool) => {
  type.forEach(file => {
    const dir = file.split('/');
    dir.pop();
    imgmin([file], dir.join('/').replace('src', 'dist'), {
      use: [tool]
    }).then(() => {
      console.log(`${file.replace('src', 'dist')}の圧縮が完了しました`);
    })
  })
}

outputFunc(dirJpg, mozjpeg());
outputFunc(dirPng, pngquant());
outputFunc(dirGif, gifsicle());
outputFunc(dirSvg, svgo({plugins: [{removeViewBox: false}]}));