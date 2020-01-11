<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div>
                <el-button type="primary" @click="onBtnAddCategory">添加分类</el-button>
            </div>

            <tree-table
                    class="tree-table"
                    :data="categoryList"
                    :columns="columns"
                    :selection-type="false"
                    :expand-type="false"
                    show-index
                    index-text="#"
                    border
                    :show-row-hover="false">
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>

                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">
                        编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">
                        删除
                    </el-button>
                </template>
            </tree-table>

            <el-pagination
                    :current-page.sync="queryInfo.pagenum"
                    :page-size="queryInfo.pagesize"
                    :page-sizes="[3,5,8]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange">
            </el-pagination>
        </el-card>

        <el-dialog
                title="添加分类"
                :visible.sync="isAddDlgVis"
                width="50%"
                @close="addDlgClose">
            <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类">
                    <el-cascader
                            props.expandTrigger="hover"
                            v-model="selectedKeys"
                            :options="parentCategoryList"
                            :props="cascaderProps"
                            @change="onCascaderChange"
                            clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="isAddDlgVis = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Category",
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                categoryList: [],
                total: 0,
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isOk'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ],
                isAddDlgVis: false,
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0,
                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ]
                },
                parentCategoryList: {},
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: "hover",
                    checkStrictly: true
                },
                selectedKeys: []
            }
        },
        methods: {
            async getCategoryList() {
                const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.categoryList = res.data.result;
                this.total = res.data.total;
            },
            handleCurrentChange(newPage, a) {
                this.queryInfo.pagenum = newPage;
                this.getCategoryList();
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCategoryList();
            },
            async onBtnAddCategory() {
                const {data: res} = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                });
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.parentCategoryList = res.data;
                this.isAddDlgVis = true;
            },
            onCascaderChange() {
                if (this.selectedKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                    this.addCateForm.cat_level = this.selectedKeys.length;
                } else {
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }
            },
            addDlgClose() {
                this.$refs.addCateFormRef.resetFields();
                this.selectedKeys = [];
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            },
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('categories', this.addCateForm);
                    if (res.meta.status !== 201) {
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message.success(res.meta.msg);
                    this.getCategoryList();
                    this.isAddDlgVis = false;
                })
            }
        },
        mounted() {
            this.getCategoryList();
        }
    }
</script>

<style lang="less" scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-icon-success {
        color: lightgreen;
    }

    .el-icon-error {
        color: red;
    }

    .el-cascader {
        width: 100%;
    }
</style>