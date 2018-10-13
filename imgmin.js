const imgmin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const notice = require('node-notifier');

imgmin(['src/**/*.{jpg,jpeg,png,gif,svg}'], 'dist', {
  plugins: [
    pngquant({ quality: '65-80' }),
    mozjpeg({ quality: 80 }),
    gifsicle(),
    svgo()
  ]
}).then(() => {
  notice.notify('画像圧縮が終了しました')
});