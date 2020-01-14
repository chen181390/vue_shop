<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert
                    title="注意：只允许为第三级分类设置相关参数"
                    type="warning"
                    show-icon
                    :closable="false">
            </el-alert>

            <div class="cat_opt">
                <span>选择商品分类：</span>
                <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="onCascaderChange">
                </el-cascader>
            </div>

            <el-tabs v-model="activeTab" @tab-click="onTab">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isAddBtnDisable" @click="addDlgVis = true">添加参数
                    </el-button>
                    <el-table
                            :data="manyTableData"
                            stripe
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="onTagClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVis"
                                        v-model="scope.row.inputVal"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="onBtnEdit(scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="onBtnDelete(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isAddBtnDisable" @click="addDlgVis = true">添加属性
                    </el-button>
                    <el-table
                            :data="onlyTableData"
                            stripe
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="onTagClose(i, scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVis"
                                        v-model="scope.row.inputVal"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="onBtnEdit(scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="onBtnDelete(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
                :title="'添加' + dlgTitle"
                :visible.sync="addDlgVis"
                width="50%"
                @close="onAddDlgClose">
            <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
                <el-form-item :label="dlgTitle" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDlgVis = false">取 消</el-button>
            <el-button type="primary" @click="addParmas">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :title="'编辑'+dlgTitle"
                :visible.sync="editDlgVis"
                width="50%"
                @close="onEditDlgClose">
            <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addFormRules">
                <el-form-item :label="dlgTitle" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDlgVis = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                cateList: [],
                selectedCateKeys: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                activeTab: 'many',
                manyTableData: null,
                onlyTableData: null,
                addDlgVis: false,
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }]
                },
                editDlgVis: false,
                editForm: {
                    attr_id: null,
                    attr_name: ''
                }
            }
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                console.log(res);
                this.cateList = res.data;
            },
            onCascaderChange() {
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys.length = 0;
                    this.$message.error('仅允许选中三级分类');
                    this.manyTableData = [];
                    this.onlyTableData = [];
                    return;
                }
                this.getAttributes();
            },
            async getAttributes() {
                if (this.selectedCateKeys.length !== 3) return;
                const cateId = this.selectedCateKeys[2];
                const {data: res} = await this.$http.get(`categories/${cateId}/attributes/`, {params: {sel: this.activeTab}});

                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    item.inputVis = false;
                    item.inputVal = '';
                });
                console.log(res);

                if (this.activeTab === 'many') {
                    this.manyTableData = res.data;
                } else {
                    this.onlyTableData = res.data;
                }
            },
            onTab() {
                this.getAttributes();
            },
            onAddDlgClose() {
                this.$refs.addFormRef.resetFields();
            },
            async addParmas() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    let cateId = this.selectedCateKeys[2];
                    const {data: res} = await this.$http.post(`categories/${cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeTab
                    });

                    if (res.meta.status !== 201) {
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message.success(res.meta.msg);
                    this.addDlgVis = false;
                    this.getAttributes();
                });
            },
            onBtnEdit(attr) {
                this.editDlgVis = true;
                this.editForm.attr_name = attr.attr_name;
                this.editForm.attr_id = attr.attr_id;
            },
            onEditDlgClose() {
                this.$refs.editFormRef.resetFields();
            },
            editParams(attr) {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    const cateId = this.selectedCateKeys[2];
                    const {data: res} = await this.$http.put(`categories/${cateId}/attributes/${this.editForm.attr_id}`,
                        {attr_name: this.editForm, attr_sel: this.activeTab});
                    if (res.meta.status !== 200) {
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message.success(res.meta.msg);
                    this.editDlgVis = false;
                    this.getAttributes();
                });
            },
            async onBtnDelete(attr) {
                const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                });
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除');
                }

                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr.attr_id}`);
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.getAttributes();
            },
            async saveAttrVals(attr) {
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${attr.attr_id}`,
                    {
                        attr_name: attr.attr_name,
                        attr_sel: attr.attr_sel,
                        attr_vals: attr.attr_vals.join(' ')
                    });
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg);
                    return false;
                }
                this.$message.success(res.meta.msg);
                return true;
            },
            async handleInputConfirm(attr) {
                if (attr.inputVal.trim().length === 0) {
                    attr.inputVis = false;
                    attr.inputVal = '';
                    return;
                }

                const result = await this.saveAttrVals(attr);
                if (!result) return;
                attr.attr_vals.push(attr.inputVal);
                attr.inputVis = false;
                attr.inputVal = '';
                this.saveAttrVals();
            },
            showInput(attr) {
                attr.inputVis = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            async onTagClose(i, attr) {
                const result = await this.saveAttrVals(attr);
                if (!result) return;
                attr.attr_vals.splice(i, 1);
            }
        },
        computed: {
            isAddBtnDisable() {
                if (this.selectedCateKeys.length === 3) {
                    return false;
                }
                return true;
            },
            dlgTitle() {
                if (this.activeName === 'many') {
                    return '动态参数';
                }
                return '静态属性';
            },
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2];
                }
                return null;
            }
        },
        mounted() {
            this.getCateList();
        }
    }
</script>

<style lang="less" scoped>
    .cat_opt {
        margin-top: 15px;
    }

    .el-tag {
        margin: 5px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>