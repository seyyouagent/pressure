<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> dubbo工具
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" :style="{
          width: '100%'
      }">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="方法名称">
                <el-input v-model="form.methodName"></el-input>
              </el-form-item>
              <el-form-item label="项目名称">
                <el-input v-model="form.applicationName"></el-input>
              </el-form-item>
              <el-form-item label="参数">
                <el-input v-model="form.params"></el-input>
              </el-form-item>
              <el-form-item label="注册中心">
                <el-input v-model="form.registryAdd"></el-input>
              </el-form-item>
              <el-form-item label="接口类名">
                <el-input v-model="form.interfaceName"></el-input>
              </el-form-item>
              <el-form-item label="参数类名">
                <el-input v-model="form.className"></el-input>
              </el-form-item>
              <el-form-item label="dubbo地址">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
              <el-form-item label="分组">
                <el-input v-model="form.group"></el-input>
              </el-form-item>
              <el-form-item label="版本">
                <el-input v-model="form.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果集">
                <json-viewer :value="form.desc" :expand-depth="4" boxed></json-viewer>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">表单提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import JsonViewer from 'vue-json-viewer';
export default {
    name: 'tools',
    components: {
        JsonViewer
    },
  data() {
    return {
      form: {
        methodName: "",
        params: [],
        applicationName: "",
        registryAdd: "",
        interfaceName: "",
        className: [],
        address: "",
        group: "",
        version: "",
        desc: ""
      },
    };
  },
  methods: {
    onSubmit() {
        if(this.form.methodName == "") {
            this.$message.error("方法名不能为空！");
            return false;
        } else if(this.form.params == "") {
            this.$message.error("参数不能为空！");
            return false;
        } else if(this.form.applicationName == "") {
            this.$message.error("项目名不能为空！");
            return false;
        } else if(this.form.registryAdd == "") {
            this.$message.error("注册中心地址不能为空！");
            return false;
        } else if(this.form.className == "") {
            this.$message.error("参数类型不能为空！");
            return false;
        } else if(this.form.address == "") {
            this.$message.error("dubbo地址不能为空！");
            return false;
        } else if(this.form.group == "") {
            this.$message.error("分组不能为空！");
            return false;
        }

        this.form.desc = "";

        let params = Object.assign({}, this.form)
        params.params = JSON.parse(params.params)
        params.className = JSON.parse(params.className)
        Axios.post("/dubboClient/httpDubbos",params)
        .then(( { data = {} }) => {
            if(data.status == 200) {
                this.form.desc = data
            }
        }).catch(error => {
            this.$message.error("访问失败！");
        })
    },
  },
};
</script>