const {S3,STS} = require('aws-sdk');

const sts = new STS({
  endpoint: 'http://localhost:9000',
  apiVersion: '2011-06-15',
  region: 'cn-east-hefei',
  credentials:{
    accessKeyId: 'admin',
    secretAccessKey: 'admin@123'
  }
});

(function(){
  sts.assumeRole({
    RoleArn: 'arn:xxx:xxx:xxx:xxxx',
    RoleSessionName: 'xxx',
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            's3:GetObject',
            's3:GetBucketLocation'
          ],
          Resource: [
            'arn:aws:s3:::*'
          ]
        }
      ]
    })
  },(err,data)=>{
    if(err){
      console.error(err);
    }else {
      const {Credentials} = data;
      console.log(Credentials);

      const credentials = {
        accessKeyId:Credentials.AccessKeyId,
        secretAccessKey:Credentials.SecretAccessKey,
        sessionToken:Credentials.SessionToken
      };

      const s3 = new S3({
        endpoint: 'http://localhost:9000',
        credentials: credentials,
        apiVersion: '2011-06-15',
        region: 'cn-east-hefei'
      });

      s3.getObject({Bucket:'test',Key:'avatar.jpg'},(err,data)=>{
        if(err){
          console.log(err);
        }else {
          console.log(data);
        }
      });
    }
  });
}());

