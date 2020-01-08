<template>
    <el-container>
        <el-header>
            <div id="title">
                <img src="../assets/img/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout" id="btn-logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#373d41"
                        text-color="#fff"
                        active-text-color="#409bff"
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        router
                        :default-active="$route.path">
                    <el-submenu :index="item.id + ''" v-for="item in this.menulist" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+item.path" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menulist: null,
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                isCollapse: false
            };
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            async getMenuList() {
                const {data: res} = await this.$http.get('menus');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.menulist = res.data;
            },
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            }
        },
        mounted() {
            this.getMenuList();
        }
    }
</script>

<style lang="less" scoped>
    .el-container {
        height: 100%;

        .el-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
            font-size: 20px;
            background-color: #373d41;

            #title {
                float: left;

                img {
                    vertical-align: middle;
                    margin-right: 15px;
                }

                span {
                    vertical-align: middle;
                }
            }
        }

        .el-aside {
            background-color: #373d41;
            transition: width 0.4s;

            .toggle-button {
                height: 24px;
                background-color: #4a5064;
                text-align: center;
                line-height: 24px;
                color: white;
                font-size: 10px;
                letter-spacing: 0.2em;
                cursor: pointer;
            }

            .el-menu {
                border-right: none;

                .iconfont {
                    margin-right: 10px;
                }
            }

        }

        .el-main {
            background-color: #eaedf1;
        }
    }

</style>