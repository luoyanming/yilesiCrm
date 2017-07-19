<template>
    <div class="app-container">
        <div class="container-wrapper">
            <div class="login-form">
                <h1 class="title">易乐思后台管理系统</h1>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
                    <el-form-item prop="account">
                        <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" :disabled="!ruleForm.account || !ruleForm.password" @click="submitForm('ruleForm')">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { doLogin } from '../api/api';
    
    export default {
        data() {
            return {
                loading: false,
                ruleForm: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;

                        let loginParam = { 'mobile': this.ruleForm.account, 'password': this.ruleForm.password };

                        doLogin(loginParam).then(res => {
                            this.loading = false;

                            let { msg, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '登录成功', type: 'success'});
                                localStorage.setItem('account', this.ruleForm.account);
                                this.$router.push({ path: '/course' });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .login-form{
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        width: 500px;
        padding: 50px 0;
        background: #FFFFFF;
        box-shadow: 0 8px 39px 0 rgba(0,0,0,0.05);
        -webkit-transform: translate3d(-50%, -50%, 0);
                transform: translate3d(-50%, -50%, 0);

        .title{
            font-size: 16px;
            color: #333333;
            line-height: 22px;
            text-align: center;
            font-weight: normal;
        }

        .el-form{
            padding: 30px 80px 0;

            .el-form-item{
                margin-bottom: 30px;

                .el-input{
                    .el-input__inner{
                        height: 50px;
                        font-size: 14px;
                        color: #333333;
                        line-height: 30px;
                        padding: 0 20px;
                        border-radius: 0;
                        border: 1px solid #E5E5E5;

                        &:hover{
                            border-color: rgb(131, 165, 162);
                        }

                        &:focus{
                            border-color: #18c79c;
                        }
                    }
                }

                .el-button{
                    width: 100%;
                    height: 50px;
                    padding: 0;
                    font-size: 14px;
                    line-height: 50px;
                    color: #FFFFFF;
                    text-align: center;
                    background: #20B681;
                    border-radius: 0;
                    border: none;

                    &.is-disabled{
                        opacity: 0.6;
                    }
                }

                &.is-error{
                    .el-input{
                        .el-input__inner{
                            border-color: #ff4949;
                        }
                    }
                }
            }
        }
    }
</style>
