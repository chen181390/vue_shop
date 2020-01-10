<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDlgVis = true">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table
                    :data="userlist"
                    style="width: 100%"
                    border
                    stripe>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyDlgOpen(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="queryInfo.pagenum"
                    :page-sizes="[3, 5, 7]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
                title="添加用户"
                :visible.sync="addDlgVis"
                width="50%"
                @close="addDlgClose">
            <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDlgVis = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="修改用户信息"
                :visible.sync="modifyDlgVis"
                width="50%"
                @close="modifyDlgClose">
            <el-form ref="modifyFormRef" :model="modifyForm" :rules="formRules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="modifyForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="modifyForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="modifyForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyDlgVis = false">取 消</el-button>
                <el-button type="primary" @click="modifyUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            let checkEmail = (rule, value, cb) => {
                const regEmail = /^[\w_-]+@[\w_-]+[\w_-]/;
                if (regEmail.test(value)) {
                    return cb();
                }
                cb(new Error('请输入合法邮箱'));
            };

            let checkMobile = (rule, value, cb) => {
                const regMobile = /^(0|86|17951)?(13\d|15\d|17[678]|18\d|14[57])\d{8}$/;
                if (regMobile.test(value)) {
                    return cb();
                }
                cb(new Error('请输入合法手机号'));
            }
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 3,
                },
                userlist: null,
                total: 0,
                addDlgVis: false,
                addForm: {
                    username: null,
                    password: null,
                    email: null,
                    mobile: null
                },
                formRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '密码长度在6-15位', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                modifyDlgVis: false,
                modifyForm: {
                    username: null,
                    email: null,
                    mobile: null
                }
            }
        },
        methods: {
            async getUserList() {
                let {data: res} = await this.$http.get('users', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.userlist = res.data.users;
                this.total = res.data.total;
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },
            async userStateChanged(userinfo) {
                const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state;
                    return this.$message.error(res.meta.msg);
                }
                this.$message.success(res.meta.msg);
            },
            addDlgClose() {
                this.$refs.addFormRef.resetFields();
            },
            addUser() {
                this.$refs.addFormRef.validate( async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('users', this.addForm);
                    if (res.meta.status !== 201) {
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message.success('添加用户成功');
                    this.addDlgVis = false;
                    this.getUserList();
                });
            },
            async modifyDlgOpen(id) {
                const {data: res} = await this.$http.get('users/' + id);
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户数据失败');
                }
                this.modifyForm = res.data;
                this.modifyDlgVis = true;
            },
            modifyDlgClose() {
                this.$refs.modifyFormRef.resetFields();
            },
            modifyUser() {
                this.$refs.modifyFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`users/${this.modifyForm.id}`,
                        {email: this.modifyForm.email, mobile: this.modifyForm.mobile});
                    if (res.meta.status !== 200) {
                        return this.$message.error(res.meta.msg);
                    }
                    this.getUserList();
                    this.modifyDlgVis = false;
                    this.$message.success('更新用户成功');
                })
            },
            async removeUserById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);

                if (confirmResult !== 'confirm')
                    return this.$message.info('已取消删除');

                const {data: res} = await this.$http.delete('users/' + id);
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                if (this.userlist.length === 1) {
                    this.queryInfo.pagenum--;
                    if (this.queryInfo.pagenum < 0)
                        this.queryInfo.pagenum = 0;
                }
                this.getUserList();
            }
        },
        mounted() {
            this.getUserList();
        }
    }
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

        .el-row {
            * {
                vertical-align: middle;
            }
        }

        .el-table {
            margin-top: 15px;
            font-size: 12px;
        }

        .el-pagination {
            margin-top: 15px;
        }
    }
</style>