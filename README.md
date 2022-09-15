# minio-sts-sample

## 前言

在使用 `OSS` 对象存储的时候，一般的做法是后端对接 `OSS` 服务商，文件经过后端中转后上传到 `OSS`。但是这样可能会占用后端的带宽，严重的可能把后端服务拖垮。但是如果直接使用前端 `SDK` 上传，会导致上传密钥泄漏。不少公司因为成本或者安全性问题会使用自建 Minio，但是Minio这方面资料较少。那么有没有很好的办法解决这个问题呢？

## Docker 安装 Minio

```shell
sudo docker run -itd --name minio -p 9000:9000 -p 9090:9090 -v /minio/data:/data -e MINIO_ROOT_USER=root -e MINIO_ROOT_PASSWORD=root@123 minio/minio server /data --console-address ":9090" --address ":9000"
```

## STS (Security Token Server)

使用 `STS` 上传文件到 `Minio` 的流程如下所示：

![Minio使用STS上传文件流程](/docs/assets/images/process.png)

## 使用 AWS-SDK 对接 MINIO

`Minio` 官方提供的 `SDK` 貌似没有实现 `STS` 的功能，但是没有关系，因为 `Minio` 是兼容 `AWS S3` 协议的，我们可以直接使用 `AWS SDK`。下面是一些参考文章：

[使用 STS AssumRole](https://github.com/minio/minio/blob/master/docs/sts/assume-role.md)

[使用 AWS 的 JavaScript SDK 访问 Minio](https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html)

获取临时凭证:

```javascript
const sts = new STS({
  endpoint: "http://localhost:9000", // Minio的地址
  apiVersion: "2011-06-15", // 固定值
  region: "local", // 地域名称，在web控制台中配置
  credentials: {
    accessKeyId: "admin", // 访问凭证
    secretAccessKey: "admin@123", // 访问凭证密码
  },
});

sts.assumeRole(
  {
    RoleArn: "", // 为空或者随便填，使用 Minio 无实际意义
    RoleSessionName: "", // 为空或者随便填，使用 Minio 无实际意义
    Policy: JSON.stringify({
      Version: "2012-10-17", // 协议版本，固定值
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:GetBucketLocation"],
          Resource: ["arn:aws:s3:::*"],
        },
      ],
    }), // web控制台可以生成查看
  },
  (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const { Credentials } = data;
      console.log(Credentials);
      // 这里获取的凭证是 JSON 类型，里面的 Key 都是大写开头，使用的时候需要转换为下面参数中小驼峰
    }
  }
);
```

使用临时凭证获取文件

```javascript
const credentials = {
  accessKeyId: Credentials.AccessKeyId,
  secretAccessKey: Credentials.SecretAccessKey,
  sessionToken: Credentials.SessionToken,
};

const s3 = new S3({
  endpoint: "http://localhost:9000", // Minio的地址
  credentials: credentials, // 临时凭证
  apiVersion: "2011-06-15", // 固定值
  region: "local", // 地域名称，在web控制台中配置
  s3ForcePathStyle: true, // 使用 Minio 必须加上，踩的坑
});

s3.getObject(
  { Bucket: "test", Key: "screenshot-page-about.png" },
  (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
);
```

## 最佳实践

[Vue 项目示例](/samples/vue-sample/)

[服务端项目示例](/samples/server-sample/)
