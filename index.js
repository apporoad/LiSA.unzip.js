const fs = require('fs')
const path = require('path')
const mkdir = (path) => {
  return new Promise((r, j) => {
    fs.mkdir(path, (err) => {
      if (err) {
        j(err)
      } else {
        r()
      }
    })
  })
}

const join = path.join
const util =require('util')
const yauzl = require("yauzl");
const open = util.promisify(yauzl.open)

exports.unzip = async (zipPath, tgtDir , options) => {
  options = options || {}
  var log = options.log || false
  var unzipDir = tgtDir  || process.cwd()
  var filePath = path.resolve(process.cwd(), zipPath)
  if(!fs.existsSync(unzipDir)){
    fs.mkdirSync(unzipDir)
  }
  const zipFile = await open(filePath, {
    lazyEntries: true
  });
  await new Promise((resolve, reject) => {
    zipFile.readEntry();
    zipFile.once("end", resolve);
    zipFile.on("entry", (entry) => {
      if (/\/$/.test(entry.fileName)) {
        if (log) {
          console.log(`Directory: ${entry.fileName}`);
        }
        mkdir(join(unzipDir, entry.fileName), {
            recursive: true
          })
          .then(() => zipFile.readEntry())
          .catch(reject);
      } else {
        zipFile.openReadStream(entry, (err, readStream) => {
          if (err) {
            return reject(err);
          }
          readStream.once("error", reject);
          readStream.once("end", () => zipFile.readEntry());
          if (log) {
            console.log(`File: ${entry.fileName}`);
          }
          const wS = fs.createWriteStream(join(unzipDir, entry.fileName));
          wS.once("error", reject);
          readStream.pipe(wS);
          return void 0;
        });
      }
    });
  });
}

