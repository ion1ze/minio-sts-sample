const {STS} = require('aws-sdk');

module.exports = class FileService {
  constructor(){
    this.sts = this._createSTSClient();
  }

  _createSTSClient(){
    const client = new STS({
      endpoint: 'http://localhost:9000',
      apiVersion: '2011-06-15',
      region: 'local',
      credentials:{
        accessKeyId: 'admin',
        secretAccessKey: 'admin@123'
      }
    });
    return client;
  }

  assumeRole(){
    return new Promise((resolve,reject)=>{
      this.sts.assumeRole({
        RoleArn: '',
        RoleSessionName: '',
        Policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                's3:*',
              ],
              Resource: [
                'arn:aws:s3:::*'
              ]
            }
          ]
        })
      },(err,data)=>{
        if(err){
          reject(err);
          return;
        }
        const {Credentials} = data;
        const credentials = {
          accessKeyId:Credentials.AccessKeyId,
          secretAccessKey:Credentials.SecretAccessKey,
          sessionToken:Credentials.SessionToken
        };
        resolve({credentials});
      });
    });
  }
}