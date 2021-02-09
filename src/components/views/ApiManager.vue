<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 基础管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>接口管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="width-new">
                <el-form ref="form" :model="form">                    
                    <el-form-item label="接口名称" >
                        <el-input v-model="form.apiName" style="width:95%"></el-input>
                    </el-form-item>
                    <el-form-item class="input-with-select"> 
                            <el-select v-model="form.apiAgreement" placeholder="接口协议" style="width:100px">
                                <el-option key="http" label="HTTP" value="http"></el-option>
                                <el-option key="https" label="HTTPS" value="https"></el-option>
                            </el-select>
                            <el-select v-model="form.apiReqMethod" placeholder="请求方式"  style="width:100px">
                                <el-option key="post" label="POST" value="post"></el-option>
                                <el-option key="get" label="GET" value="get"></el-option>
                            </el-select>  
                            <el-input v-model="form.apiUrl" placeholder="路径"  style="width:85%"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-divider content-position="left">请求头部</el-divider>
                            <div>
                                <el-table :data="form.headerExperience" border style="width:100%"> 
                                    <el-table-column label="Header名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.headerkey">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Header值">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.headervalue">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="200px" >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="success" icon="el-icon-lx-add" style="margin-right:10px;" size="mini"
                                                @click="pushNewHeader()"
                                            ></el-button>                        
                                            <el-button
                                                type="danger" icon="el-icon-lx-delete" size="mini"
                                                @click="deleteHeader(scope.$index)"
                                            ></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>                                
                            </div> 
                    </el-form-item>
                    <el-form-item>
                        <el-divider content-position="left">请求参数</el-divider>
                            <div>
                                <el-form-item>
                                    <el-radio-group v-model="form.requestData" @change="changerequestdata">
                                        <el-radio :label="1" >消息体数据(raw)</el-radio>
                                        <el-radio :label="2">表单参数</el-radio>
                                    </el-radio-group  >                                    
                                    <el-checkbox v-model="form.upFile" :label="3" name="type" style="margin-left:30px">文件上传</el-checkbox>
                                </el-form-item>    

                                <div v-if="form.requestData == 1">
                                    <el-form-item>
                                        <el-input type="textarea" rows="7" v-model="form.apiparamtext"></el-input>
                                    </el-form-item>
                                </div>
                                <div v-if="form.requestData == 2">
                                    <el-table :data="form.paramsExperience" border  style="width:100%"> 
                                        <el-table-column label="参数名" >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.paramkey">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="参数值">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.paramvalue">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="200px" >
                                            <template slot-scope="scope">
                                                <el-button
                                                    type="success" icon="el-icon-lx-add" style="margin-right:10px;" size="mini"
                                                    @click="pushNewParams(scope.$index)"
                                                ></el-button>                        
                                                <el-button
                                                    type="danger" icon="el-icon-lx-delete" size="mini"
                                                    @click="deleteParams(scope.$index)"
                                                ></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>   
                                </div>
                                <div v-if="form.upFile">
                                    <el-table :data="form.fileExperience" border  style="width:100%"> 
                                        <el-table-column label="文件路径" >
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.filekey">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="参数名称">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.filevalue">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="200px" >
                                            <template slot-scope="scope">
                                                <el-button
                                                    type="success" icon="el-icon-lx-add" style="margin-right:10px;" size="mini"
                                                    @click="pushNewFiler(scope.$index)"
                                                ></el-button>                        
                                                <el-button
                                                    type="danger" icon="el-icon-lx-delete" size="mini"
                                                    @click="deleteFiler(scope.$index)"
                                                ></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>   
                                </div>
                            </div>
                    </el-form-item>
                    <el-form-item>
                            <div>
                                <el-divider content-position="left">返回校验</el-divider>
                                <el-form-item label="校验响应内容 *">
                                    <el-input v-model="form.verifResponse" class="input-with-select" style="width:92%">
                                    <el-select v-model="form.verifResponseStatus" slot="prepend" placeholder="请选择" style="width:140px">
                                        <el-option label="响应内容包含" value="1"></el-option>
                                        <el-option label="Http状态码为" value="2"></el-option>
                                    </el-select>
                                </el-input>
                                </el-form-item>
                            </div>
                    </el-form-item>       
                    <el-collapse  @change="handleChange" v-model="form.activeNames">       
                        <el-collapse-item  name="1">
                                <span class="collapse-title" slot="title">数据关联</span>
                                <div>
                                    <el-form-item label="响应范围 *" >
                                        <el-select v-model="form.responseRange" placeholder="请选择" style="width:100px">
                                            <el-option key="body" label="Body" value="body"></el-option>
                                            <el-option key="header" label="Header" value="header"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="保存参数 *" >
                                        <el-input v-model="form.saveParam" style="width:80%"></el-input>
                                    </el-form-item>
                                    <el-form-item label="正则表达式 *" >
                                        <el-input v-model="form.regularExpression" style="width:80%"></el-input>
                                    </el-form-item>
                                    <el-form-item label="模板 *" >
                                        <el-input v-model="form.template" style="width:80%"></el-input>
                                    </el-form-item>
                                    <el-form-item label="匹配数字 *" >
                                        <el-input v-model="form.matchNumber" style="width:80%"></el-input>
                                    </el-form-item>                                    
                                </div>
                        </el-collapse-item>       
                    </el-collapse>
                    <el-form-item label="备注">
                        <el-input type="textarea" rows="2" v-model="form.remark" style="width:95%"></el-input>
                    </el-form-item>
                    <el-form-item>

                        <div align="center" style="margin-top:30px;box-sizing: border-box;">
                            <span slot="footer" class="dialog-footer" >
                                <el-button @click="dialogVisible = false" style="margin-right:30px;padding:8px 30px">取  消</el-button>
                                <el-button type="primary" @click="insertEdit()" style=";padding:8px 30px">确  定</el-button>
                            </span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';
export default {
    name: 'baseform',
    data() {
        return {            
            form: {
                apiName: '',
                apiAgreement: '',
                apiReqMethod: '',
                apiUrl: '',
                headerExperience: [{headerkey: '',headervalue: ''}],
                requestData: 1,                
                upFile: '',
                paramsExperience: [{paramkey: '',paramvalue: ''}],
                fileExperience: [{filekey: '',filevalue: ''}],
                verifResponse: '',
                verifResponseStatus:'',
                activeNames: '',
                responseRange: '',
                saveParam: '',
                regularExpression: '',
                template: '',
                matchNumber: '',
                remark:''
            },            
            activeNames: [], //折叠面板，默认哪些显示
        };
    },
    methods: {
        changerequestdata(val){ //参数勾选console输出
            console.log(val, 'val')
            console.log(this.linkinput, 'input的值')
        },
        // 新增编辑
        insertEdit() {
            let params=this.form;
            Axios.post("/api/apiInsert",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success(data.msg);
                       // this.dialogVisible = false;           //关闭弹框
                       // this.handleSearch();                  //刷新列表  没做
                    }
                }).catch(error => {
                    this.$message.error("更新失败");
            })            
        },
        handleChange(val) {
        console.log(val);
        },
        // 添加Header
        pushNewHeader() {
            const list = this.form.headerExperience;
            list.push({            
                headerkey: '',
                headervalue: ''
            });
            this.form.headerExperience = list;
        },
        // 删除Header
        deleteHeader(index) {
            const list = this.form.headerExperience;
            if (index === 0 && list.length === 1) {
            list.splice(index, 1);
            list.push({
                headerkey: '',
                headervalue: '',
            });
        } else {
            list.splice(index, 1);
        }
        if (index === list.length) {
            list[index - 1].show = 'true';
        }
        list = this.form.headerExperience;
        },
        // 添加Params
        pushNewParams() {
            const list = this.form.paramsExperience;
            list.push({            
                paramkey: '',
                paramvalue: ''
            });
            this.form.paramsExperience = list;
        },
        // 删除Params
        deleteParams(index) {
            const list = this.form.paramsExperience;
            if (index === 0 && list.length === 1) {
            list.splice(index, 1);
            list.push({
                paramkey: '',
                paramvalue: ''
            });
        } else {
            list.splice(index, 1);
        }
        if (index === list.length) {
            list[index - 1].show = 'true';
        }
        list = this.form.paramsExperience;
        },
        // 添加File
        pushNewFiler() {
            const list = this.form.fileExperience;
            list.push({            
                filekey: '',
                filevalue: '',
            });
            this.form.fileExperience = list;
        },
        // 删除File
        deleteFiler(index) {
            const list = this.form.fileExperience;
            if (index === 0 && list.length === 1) {
            list.splice(index, 1);
            list.push({
                filekey: '',
                filevalue: ''
            });
        } else {
            list.splice(index, 1);
        }
        if (index === list.length) {
            list[index - 1].show = 'true';
        }
        list = this.form.fileExperience;      
        },
        

      
    }    
};

</script>

