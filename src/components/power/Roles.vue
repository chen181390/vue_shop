<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom',i1===0?'bdtop':'']" v-for="(item1, i1) in scope.row.children"
                                :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="i2===0?'':'bdtop'" v-for="(item2, i2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable
                                            @close="removeRightById(scope.row, item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDlg(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
                title="分配权限"
                :visible.sync="isSetRightDlgVis"
                width="50%">
            <el-tree
                    :data="rightList"
                    :props="treeProps"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :default-checked-keys="defaultKeys"
                    ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isSetRightDlgVis = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                roleList: [],
                isSetRightDlgVis: false,
                rightList: [],
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                defaultKeys: [107],
                currRoleId: null
            }
        },
        methods: {
            async getRoleList() {
                const {data: res} = await this.$http.get('roles');
                console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.roleList = res.data;
            },
            async removeRightById(role, rightId) {
                const confirmResult = await this.$confirm('此操作会永久删除该权限，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除操作');
                }
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.$message.success(res.meta.msg);
                role.children = res.data;
            },
            async showSetRightDlg(roleInfo) {
                const {data: res} = await this.$http.get('rights/tree');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.rightList = res.data;
                this.defaultKeys = [];
                this.setLeafKeys(roleInfo);
                this.currRoleId = roleInfo.id;
                this.isSetRightDlgVis = true;
            },
            setLeafKeys(rightInfo) {
                if (!rightInfo.children) {
                    return this.defaultKeys.push(rightInfo.id);
                }
                for (let child of rightInfo.children) {
                    this.setLeafKeys(child);
                }
            },
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const keysStr = keys.join(',');
                const {data: res} = await this.$http.post(`roles/${this.currRoleId}/rights`, {rids: keysStr});
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.$message.success(res.meta.msg);
                this.getRoleList();
                this.isSetRightDlgVis  = false;
            }
        },
        mounted() {
            this.getRoleList();
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>