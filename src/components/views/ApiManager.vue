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
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="handleAdd"
                >新 增</el-button>
                <el-input v-model="form.apiName" placeholder="接口名称" class="handle-input mr10"></el-input>
                <el-input v-model="form.apiUrl" placeholder="Url" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>
            </div>
            <el-table                
                :data="tableData"
                ref="multipleTable"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="id" width="55" align="center"></el-table-column> 
                <el-table-column prop="apiName" label="接口名称"></el-table-column>               
                <el-table-column prop="apiType" label="请求类型" width="70px"></el-table-column>
                <el-table-column prop="apiRequestMethod" label="请求方式" width="70px"></el-table-column>
                <el-table-column prop="apiUrl" label="Url"></el-table-column>
                <el-table-column prop="headers" label="Header">
                    <template slot-scope="scope">
                        <el-row v-for="hkv in JSON.parse(scope.row.headers)" :key="hkv.headerkey" :value="hkv.headervalue">
                            {{hkv.headerkey}} : {{hkv.headervalue}};
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="params" label="Body"></el-table-column>
                <el-table-column prop="remark" label="接口描述"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-document"
                            style="margin-right:5px;"
                            class="green"
                            @click="handleCopy(scope.row.id, scope.row)"
                        >复制</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            style="margin-right:5px;"
                            @click="handleEdit(scope.row.id, scope.row)" 
                        >更新</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row.id,scope.row)"  
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination                    
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="currentPage"
                    :page-sizes="[1,10, 20, 50, 100]"
                    :total="total"
                    @current-change="handlePagesChange"
                    @size-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

         <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%">
            <div class="container">
                <div class="width-new">
                    <el-form ref="form" :model="dialogform">           
                        <el-form-item label="接口名称" >
                            <el-input v-model="dialogform.apiName" style="width:93%"></el-input>
                        </el-form-item>
                        <el-form-item class="input-with-select"> 
                                <el-select v-model="dialogform.apiType" placeholder="接口协议" style="width:100px">
                                    <el-option key="http" label="HTTP" value="http"></el-option>
                                    <el-option key="https" label="HTTPS" value="https"></el-option>
                                </el-select>
                                <el-select v-model="dialogform.apiRequestMethod" placeholder="请求方式"  style="width:100px">
                                    <el-option key="post" label="POST" value="post"></el-option>
                                    <el-option key="get" label="GET" value="get"></el-option>
                                </el-select>  
                                <el-input v-model="dialogform.apiUrl" placeholder="路径"  style="width:81%"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-divider content-position="left">请求头部</el-divider>
                                <el-table :data="dialogform.headers" border style="width:100%"> 
                                    <el-table-column   prop="headerkey"  label="Header名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.headerkey">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  prop="headervalue"  label="Header值">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.headervalue">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作"  width="200px" >
                                        <template slot-scope="scope">
                                            <el-button type="primary" plain icon="el-icon-lx-add" style="width:80px" size="mini" @click="pushNewHeader()"></el-button>
                                            <el-button type="danger" icon="el-icon-lx-delete" size="mini" style="width:80px" @click="deleteHeader(scope.$index)"></el-button>
                                        </template>
                                    </el-table-column>                               
                                </el-table>  
                        </el-form-item>
                        <el-form-item>
                            <el-divider content-position="left">请求参数<el-checkbox v-model="dialogform.upFile" name="type" style="margin-left:30px">文件上传</el-checkbox></el-divider>
                                <el-form-item>
                                    <el-input type="textarea" rows="6" v-model="dialogform.params"></el-input>
                                </el-form-item>                                                                
                                <div v-if="dialogform.upFile">
                                    <el-table :data="dialogform.files" border  style="width:100%"> 
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
                                                <el-button type="primary" plain icon="el-icon-lx-add" style="width:80px" size="mini" @click="pushNewFiler()"></el-button>
                                                <el-button type="danger" icon="el-icon-lx-delete" size="mini" style="width:80px" @click="deleteFiler(scope.$index)"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>   
                                </div>
                        </el-form-item>
                        <el-form-item>                                
                            <el-divider content-position="left">返回校验</el-divider>
                            <el-table :data="dialogform.verifResponse" border  style="width:100%"> 
                                <el-table-column label="校验类型" >
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.verifkey" placeholder="请选择" prop="region"> 
                                            <!-- <el-option v-for="item in verifkey" :key="item.key" :label="item.key" :value="item.value">  -->
                                                <el-option label="响应内容包含" value="contains"/>
                                                <el-option label="Http状态码为" value="code"/>
                                            <!-- </el-option>  -->
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="校验响应内容">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.verifvalue">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="200px" >
                                    <template slot-scope="scope">
                                        <el-button type="primary" plain icon="el-icon-lx-add" style="width:80px" size="mini" @click="pushNewVerif()"></el-button>
                                        <el-button type="danger" icon="el-icon-lx-delete" size="mini" style="width:80px" @click="deleteVerif(scope.$index)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>                                
                        </el-form-item>       
                        <el-collapse v-model="dialogform.activeNames">       
                            <el-collapse-item  name="1">
                                    <span class="collapse-title" slot="title"  style="margin-left:20px">数据关联</span>
                                    <div>
                                        <el-form-item label="响应范围 *" >
                                            <el-select v-model="dialogform.relationResponseRange" placeholder="请选择" style="width:100px">
                                                <el-option key="body" label="Body" value="body"></el-option>
                                                <el-option key="header" label="Header" value="header"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="保存参数 *" >
                                            <el-input v-model="dialogform.relationSaveParam" style="width:80%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="正则表达式 *" >
                                            <el-input v-model="dialogform.relationRegularExpression" style="width:80%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="模板 *" >
                                            <el-input v-model="dialogform.relationTemplate" style="width:80%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="匹配数字 *" >
                                            <el-input v-model="dialogform.relationMatchNumber" style="width:80%"></el-input>
                                        </el-form-item>                                    
                                    </div>
                            </el-collapse-item>       
                        </el-collapse>
                        <el-form-item label="备注">
                            <el-input type="textarea" rows="2" v-model="dialogform.remark" style="width:95%"></el-input>
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
        </el-dialog>
    </div>       
</template>


<script>
import Axios from 'axios';
export default {
    name: 'baseform',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            delList: [],
            dialogTitle : '',
            dialogVisible: false,
            total: 0,
            currentPage:1,
            pageSize:10,
            total:0,
            form: {
                apiName: '',
                apiUrl: ''
            },
            dialogform:{
                apiName: '',
                apiType: '',
                apiRequestMethod: '',
                apiUrl: '',
                headers: [{headerkey: '',headervalue: ''}],
                //headers: [{"headervalue":"application/json;charset=UTF-8","headerkey":"Content-Type"}],
                upFile: '',
                params: '',
                files: [{filekey: '',filevalue: ''}],
                verifResponse: [{verifkey: '',verifvalue: ''}],
                activeNames: [],
                relationResponseRange: '',
                relationSaveParam: '',
                relationRegularExpression: '',
                relationTemplate: '',
                relationMatchNumber: '',
                remark:''
            },
            idx: -1,
            id: -1,
            headerss:[{"headervalue":"application/json;charset=UTF-8","headerkey":"Content-Type"}],
            //dialogform:{activeNames: ['1']}, //折叠面板，默认哪些显示 
                       
        };
    },
    created() {
        this.handleSearch();
    
    },
    methods: {
        // 触发搜索按钮
        handleSearch() {
            const { pageSize, currentPage} = this;
            const params = {
                ...this.form,
                pageSize,
                pageNum: currentPage
            }
            Axios.post("/apiInfo/selectAllApiInfo",params)
            .then(( { data = {} })=> {
                if (data.status == 200) {
                    console.log(data.result)
                    this.tableData = data.result.list
                    this.total = data.result.total
                } else {
                    this.$message.error("访问失败");
                }
            }).catch(error => {
                this.$message.error("访问失败");
            }) 
        },
        //接口复制
        handleCopy(index, row){
            const params = {
                id : index
            }
            Axios.post("/apiInfo/copySelectiveApiInfo",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success(data.msg)
                        this.handleSearch();                  //刷新列表
                    }
                }).catch(error => {
                    this.$message.error("复制失败");
                })
        },
        // 删除操作
        handleDelete(index, row) {
            const params = {
                id : index
            }
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                Axios.post("/apiInfo/deleteApiInfoByPrimaryKey",params)
                    .then(( { data = {} })=> {
                        this.$message.success(data.msg);
                        this.tableData.splice(index, 1);
                        this.handleSearch();
                    })
            })
            .catch(() => {this.$message.error("删除失败");});            
        },
        handleSizeChange(){

        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            this.dialogTitle = '新 增';
            this.dialogform.id = null;
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.dialogVisible = true;
            this.dialogTitle = '更 新';
            const params = {
                id : index
            }
            Axios.post("/apiInfo/selectApiInfoById",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.dialogform = data.result;
                        this.dialogform.headers= JSON.parse(data.result.headers);//将json字符串转换成json对象
                        this.dialogform.files= JSON.parse(data.result.files);
                        this.dialogform.verifResponse= JSON.parse(data.result.verifResponse);
                        if(this.dialogform.relationSaveParam != ""){
                            this.dialogform.activeNames=['1'];
                        }
                    }
                }).catch(error => {
                    this.$message.error("查询失败");
                })
        },
        // 新增编辑
        insertEdit() {            
            if(this.dialogform.id > 0) {
                let params=this.dialogform;
                Axios.post("/apiInfo/updateApiInfoByPrimaryKeySelective",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success(data.msg)
                        // this.dialogform = {};  //清空表格数据
                        this.dialogVisible = false;           //关闭弹框
                        this.handleSearch();                 //刷新列表
                    }
                }).catch(error => {
                    this.$message.error("更新失败");
                })
            } else {                
                let reqdata=this.dialogform;
                Axios.post("/apiInfo/insertSelectiveApiInfos",reqdata)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success("新增成功")
                        // this.dialogform = {};  //清空表格数据
                        this.dialogVisible = false;           //关闭弹框
                        this.handleSearch();                  //刷新列表
                    }
                }).catch(error => {
                    this.$message.error("新增失败");
                })
            }
        },        
        // 分页导航
        handlePageChange(val) {
            this.pageSize = val
            // this.$set(this.query, 'pageIndex', val);
            this.handleSearch();
        },
        // 分页导航
        handlePagesChange(val) {
            this.currentPage = val
            // this.$set(this.query, 'pageIndex', val);
            this.handleSearch();
        },

        // changerequestdata(val){ //参数勾选console输出
        //     console.log(val, 'val')
        //     console.log(this.linkinput, 'input的值')
        // },
        
        // 添加Header
        pushNewHeader() {
            var list = this.dialogform.headers;
            list.push({           
                headerkey: '',
                headervalue: ''
            });
            this.dialogform.headers = list;
        },
        // 删除Header
        deleteHeader(index) {
            var list = this.dialogform.headers;
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
        list = this.dialogform.headers;
        },
        // 添加Verif
        pushNewVerif() {
            var list = this.dialogform.verifResponse;
            list.push({            
                verifkey: '',
                verifvalue: ''
            });
            this.dialogform.verifResponse = list;
        },
        // 删除Verif
        deleteVerif(index) {
            var list = this.dialogform.verifResponse;
            if (index === 0 && list.length === 1) {
            list.splice(index, 1);
            list.push({
                verifkey: '',
                verifvalue: ''
            });
        } else {
            list.splice(index, 1);
        }
        if (index === list.length) {
            list[index - 1].show = 'true';
        }
        list = this.dialogform.verifResponse;
        },
        // 添加File
        pushNewFiler() {
            var list = this.dialogform.files;
            list.push({            
                filekey: '',
                filevalue: '',
            });
            this.dialogform.files = list;
        },
        // 删除File
        deleteFiler(index) {
            var list = this.dialogform.files;
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
        list = this.dialogform.files;      
        },      
    }    
};

</script>

<style>
.handle-box {
    margin-bottom: 20px;
}

.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #F2F6FC;
  }

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #FF0000;
}
.green {
    color: #009900;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

