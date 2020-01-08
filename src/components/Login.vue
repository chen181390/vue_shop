<template>
    <div class="login-container">
        <div class="login-box">
            <div class="avatar_box">
                <img src="../assets/img/logo.png">
            </div>

            <el-form label-width="0px" class="el-form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                <el-form-item prop="username">
                    <el-input placeholder="用户名" prefix-icon="el-icon-user-solid" v-model="loginForm.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="密码" prefix-icon="el-icon-lock" v-model="loginForm.password"
                              type="password"></el-input>
                </el-form-item>

                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    username: [
                        {required: true, message: "请输入登录名称", trigger: "blur"},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    let {data: res} = await this.$http.post('login', this.loginForm);
                    switch (res.meta.status) {
                        case 200:
                            this.$message.success('登陆成功');
                            window.sessionStorage.setItem('token', res.data.token);
                            this.$router.push('./home');
                            break;

                        default:
                            this.$message.error('登陆失败');
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .login-container {
        background-color: #2b4b6b;
        width: 100%;
        height: 100%;

        .login-box {
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 3px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;

            .avatar_box {
                width: 130px;
                height: 130px;
                border: 1px #eee solid;
                border-radius: 50%;
                padding: 10px;
                box-shadow: 0 0 10px #ddd;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .btns {
                margin-right: 20px;
                display: flex;
                justify-content: flex-end;
                margin-top: 80px;
            }

            .el-form {
                margin-top: 60px;
                width: 96%;
                margin-left: auto;
                margin-right: auto;
            }
        }
    }
</style>