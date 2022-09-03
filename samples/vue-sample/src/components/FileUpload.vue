<template>
  <div class="file-upload">
    <input type="file" @change="handleFileInputChange" />
    <button @click="handleUpload">开始上传</button>
  </div>
</template>
<script>
import * as STSApi from "@/api/sts";
import { S3 } from "aws-sdk";
export default {
  name: "FileUpload",
  async created() {},
  data() {
    return {
      file: undefined,
    };
  },
  methods: {
    async createClient() {
      const { credentials } = await STSApi.assumeRole();
      const client = new S3({
        endpoint: "http://localhost:9000",
        credentials: credentials,
        apiVersion: "2011-06-15",
        region: "local",
        s3ForcePathStyle: true,
      });
      return client;
    },
    handleFileInputChange(event) {
      this.file = event.target.files[0];
    },
    async handleUpload() {
      if (!this.file) {
        alert("请先选择文件");
        return;
      }

      const uuid = this.$uuid.v4();
      const fileName = this.file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
      const key = `${uuid}.${fileExtension}`;

      const client = await this.createClient();
      client.putObject(
        {
          Bucket: "test",
          Body: this.file,
          Key: key,
        },
        (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
          }
        }
      );
    },
  },
};
</script>