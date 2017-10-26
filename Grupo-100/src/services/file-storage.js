const fs = require('fs');
const Promise = require('bluebird');
const { storage } = require('pkgcloud');
const amazonConfig = require('../config/amazon');

const CONTAINER_NAME = 'fundamentals-ing';

class FileStorage {
  constructor() {
    this.client = storage.createClient({
      provider: 'amazon',
      credentials: amazonConfig,
      region: 'us-west-2',
    });
  }

  upload(fileData) {
    return new Promise((resolve, reject) => {
      const remote = fileData.name;
      const writeStream = this.client.upload({ container: CONTAINER_NAME, remote });
      writeStream.on('error', reject);
      writeStream.on('success', resolve);
      const fileStream = fs.createReadStream(fileData.path);
      fileStream.pipe(writeStream);
    });
  }

  download(remotePath) {
    return this.client.download({ container: CONTAINER_NAME, remote: remotePath });
  }
}


module.exports = new FileStorage();
