const fs = require('fs');
const path = require('path');
const gifify = require('gifify');

const baseDir = __dirname.replace(/lib/, '');
const inputDir = path.join(baseDir, 'src/movie/');
const outputDir = path.join(baseDir, 'dist/movie/gif/');
const opts = {
  resize: '200:-1',
  from: 30,
  to: 35
};

const convertImgs = fs.readdir(inputDir, (err, files) => {
  const githubMovies = files.filter(file => file.includes('_github.mp4'));
  githubMovies.forEach(file => {
    const fileName = file.replace(/\.mp4/, '');
    const outputStream = fs.createWriteStream(`${outputDir}${fileName}.gif`);
    gifify(`${inputDir}${file}`, opts).pipe(outputStream);
  });
})