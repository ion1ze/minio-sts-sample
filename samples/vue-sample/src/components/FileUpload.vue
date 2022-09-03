<template>
  <div class="file-upload">
    <div class="opertation">
      <input type="file" @change="handleFileInputChange" />
      <button @click="handleUpload">开始上传</button>
    </div>
    <div class="preview">
      <img v-if="fileUrl" :src="fileUrl" alt="preview" />
    </div>
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
      fileUrl: undefined,
    };
  },
  methods: {
    async createClient() {
      const { data:{credentials} } = await STSApi.assumeRole();
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

      console.log(this.file);

      const uuid = this.$uuid.v4();
      const fileName = this.file.name;
      const fileType = this.file.type;
      const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
      const key = `${uuid}.${fileExtension}`;

      const client = await this.createClient();
      client.putObject(
        {
          Bucket: "test",
          Body: this.file,
          Key: key,
          ContentType: fileType,
        },
        (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
            this.fileUrl = this.getFileUrl(key);
          }
        }
      );
    },
    getFileUrl(key) {
      return `http://localhost:9000/test/${key}`;
    },
  },
};
</script>
<style>
.file-upload > .preview {
  padding: 20px;
}

.file-upload > .preview > img {
  height: 500px;
}
</style>