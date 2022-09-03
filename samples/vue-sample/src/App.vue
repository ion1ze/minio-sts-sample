<template>
  <div id="app">
    <div class="container">
      <div class="container-header">
        <h1>使用 Minio 文件上传</h1>
      </div>
      <div class="container-body">
        <file-upload />
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "./components/FileUpload.vue";
export default {
  name: "App",
  components: {
    FileUpload,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
