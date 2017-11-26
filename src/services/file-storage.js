const fs = require('fs');
const Promise = require('bluebird');
const { storage } = require('pkgcloud');
const googleConfig = require('../config/google');

const CONTAINER_NAME = 'fundfiles';

console.log("aquikey", googleConfig.private_key);

class FileStorage {
  constructor() {
    try{
    this.client = storage.createClient({
      provider: 'google',
      credentials: googleConfig,
      projectId: 'fundamentals-187115',
    });
    } catch (e){
      console.error(`Cloud file storage service could not be initialized. No upload or download support will be available. Error: ${e.message}`);
      this.noClientError = new Error('No cloud file storage service available');
    }
  }

  upload(fileData) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
         reject(this.noClientError);
       }
      console.log("Client is ",this.client)
      const remote = fileData.name;
      console.log("la1", remote);
      const writeStream = this.client.upload({ container: CONTAINER_NAME, remote });
      console.log("la2");
      writeStream.on('error', err=>{
        console.log("the error is ",err)
        console.log(writeStream);
        reject();});
      console.log("la3");
      writeStream.on('success', resolve);
      console.log("la4",fileData.path);
      const readStream = fs.createReadStream(fileData.path);
      console.log("la5");
      readStream.pipe(writeStream);
      console.log("la6");
    });
  }

  download(remotePath) {
    if (!this.client) {
       return Promise.reject(this.noClientError);
     }
    return this.client.download({ container: CONTAINER_NAME, remote: remotePath });
  }
}


module.exports = new FileStorage();
