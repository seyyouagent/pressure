<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公司管理
                </el-breadcrumb-item>
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
                <el-input v-model="form.aliasName" placeholder="简称" class="handle-input mr10"></el-input>
                <el-input v-model="form.companyName" placeholder="公司全称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>
            </div>
            <el-table                
                :data="tableData"
                :row-class-name="tableRowClassName"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="id" width="55" align="center"></el-table-column>
                <el-table-column prop="aliasName" label="公司名称"></el-table-column>
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
                <el-table-column prop="hierarchy" label="公司名称"></el-table-column>
                <el-table-column prop="level" label="地址"></el-table-column>
                <el-table-column prop="parentId" label="公司名称"></el-table-column>
                <el-table-column prop="status" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            style="margin-right:10px;"
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <el-form ref="form" :model="dialogform" label-width="100px">
                <el-form-item label="id：" v-show="false">
                    <el-input v-model="dialogform.id"></el-input>
                </el-form-item>
                <el-form-item label="用户名：">
                    <el-input v-model="dialogform.aliasName"></el-input>
                </el-form-item>
                <el-form-item label="地址：">
                    <el-input v-model="dialogform.companyName"></el-input>
                </el-form-item>
            </el-form>
            <div align="center" style="margin-top:30px;box-sizing: border-box;">
            <span slot="footer" class="dialog-footer" >
                <el-button @click="dialogVisible = false" style="margin-right:30px;padding:8px 30px">取  消</el-button>
                <el-button type="primary" @click="insertEdit()" style=";padding:8px 30px">确  定</el-button>
            </span></div>
        </el-dialog>
    </div>
</template>

<script>
import Axios from 'axios';
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            delList: [],
            dialogVisible: false,
            dialogTitle: '新增',
            total: 0,
            currentPage:1,
            pageSize:10,
            total:0,
            form: {
                aliasName: '',
                companyName: ''
            },
            dialogform:{
                id : 0,
                aliasName:'',
                companyName:''
            },
            idx: -1,
            id: -1
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
            Axios.post("/company/listAll",params)
            .then(( { data = {} })=> {
                if (data.status == 200) {
                    console.log(data.result)
                    this.tableData = data.result.list
                    this.total = data.result.total
                    // this.$set(this.tableData, "data", data.result);
                    // this.$message({
                    //     message: data.msg,
                    //     type: "success"
                    // });
                } else {
                    this.$message.error("访问失败");
                }
            }).catch(error => {
                this.$message.error("访问失败");
            }) 
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2=== 1) {
                return 'success-row';
            }
            return '';
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
                    Axios.post("/company/deleteByPrimaryKey",params)
                        .then(( { data = {} })=> {
                            this.$message.success(data.msg);
                            this.tableData.splice(index, 1);
                            this.handleSearch();
                        })
                })
                .catch(() => {});
            
        },
        handleSizeChange(){

        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAdd() {
            this.dialogform.aliasName = '';
            this.dialogform.companyName = '';
            this.dialogform.id = 0;
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.dialogVisible = true;
            this.dialogTitle = '更新';
            this.dialogform.id = row.id;
            this.dialogform.aliasName = row.aliasName;
            this.dialogform.companyName = row.companyName;
        },
        // 新增编辑
        insertEdit() {
            if(this.dialogform.id > 0) {
                let params=this.dialogform;
                Axios.post("/company/updateByPrimaryKeySelective",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success(data.msg)
                        // this.dialogform = {};  //清空表格数据
                        this.dialogVisible = false;           //关闭弹框
                        this.handleSearch();                  //刷新列表
                    }
                }).catch(error => {
                    this.$message.error("更新失败");
                })
            } else {
                let params=this.dialogform;
                Axios.post("/company/insert",params)
                .then(( { data = {} })=> {
                    if (data.status == 200) {
                        this.$message.success("新增成功！")
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
        }
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
    color: #ff0000;
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
