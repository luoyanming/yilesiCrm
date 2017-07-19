<template>
    <div class="app-container">
        <div class="container-wrapper">
            <header class="header">
                <div class="user-info">
                    <a href="javascript:void(0);" class="account">{{ account }}</a>
                    <span class="separate"></span>
                    <a href="javascript:void(0);" class="logout" :loading="true" @click="doLogout">退出</a>
                </div>
            </header>

            <aside class="leftnav">
                <a href="javascript:void(0);" class="logo"></a>

                <nav class="navlist">
                    <a href="javascript:void(0);" class="navitem course" v-bind:class="{'current': (current === 'course')}" @click="navClick('course')">课程上传</a>
                    <a href="javascript:void(0);" class="navitem order" v-bind:class="{'current': (current === 'order')}" @click="navClick('order')">订单管理</a>
                </nav>
            </aside>

            <section class="main">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </section>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { doLogout } from '../api/api';

    export default {
        data() {
            return {
                account: JSON.parse(localStorage.getItem('account')),
                current: 'course'
            };
        },
        methods: {
            getNavType() {
                this.current = this.$store.state.leftnav;
            },
            navClick(type) {
                this.$store.state.leftnav = type;
                this.$router.push({ path: '/' + type });
            },
            doLogout() {
                doLogout({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.$message({ message: '退出登录成功', type: 'success'});
                        this.$router.push({ path: '/login' });
                    }
                });
            }
        },
        watch: {
            '$store.state.leftnav': 'getNavType'
        }
    }
</script>

<style lang="scss" scoped>
    .header{
        position: absolute;
        z-index: 100;
        top: 0;
        right: 0;
        left: 180px;
        height: 70px;
        background: #FFFFFF;
        box-shadow: 0 1px 0 0 #EBEBEB;

        .user-info{
            float: right;
            padding: 0 40px 0 30px;
            height: 70px;
            text-align: center;
            background: url('/static/icon-user.png') no-repeat left center;
            background-size: 18px auto;

            .account{
                display: inline-block;
                margin-top: 26px;
                font-size: 12px;
                color: #666666;
                line-height: 18px;
            }

            .separate{
                display: inline-block;
                margin: 29px 20px 0;
                width: 1px;
                height: 12px;
                background: #E5E5E5;
            }

            .logout{
                display: inline-block;
                margin-top: 26px;
                font-size: 12px;
                color: #333333;
                line-height: 18px;
            }
        }
    }

    .leftnav{
        position: absolute;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        width: 180px;
        background: #333333;

        .logo{
            display: block;
            height: 70px;
            background: url('/static/logo.png') no-repeat center center;
            background-size: 100% 100%;
        }

        .navlist{
            .navitem{
                display: block;
                height: 60px;
                padding-left: 62px;
                font-size: 14px;
                color: #FFFFFF;
                line-height: 60px;
                opacity: .5;


                &.course{
                    background: url('/static/icon-upload.png') no-repeat 20px center;
                    background-size: 30px 30px;
                }

                &.order{
                    background: url('/static/icon-order.png') no-repeat 20px center;
                    background-size: 30px 30px;
                }

                &.current{
                    background-color: #20B681;
                    opacity: 1;

                    &:hover{
                        opacity: 1;
                    }
                }

                &:hover{
                    opacity: 0.8;
                }
            }
        }
    }

    .main{
        position: absolute;
        z-index: 50;
        top: 70px;
        right: 0;
        bottom: 0;
        left: 180px;
        padding: 30px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>
