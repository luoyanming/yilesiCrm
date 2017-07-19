<template>
    <div class="main-wrapper">
        <section class="crumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <section class="searchbar searchbar-order">
            <el-form :model="searchForm" ref="searchForm" class="demo-form-inline" :inline="true">
                <!-- 用户名 -->
                <el-form-item label="用户名">
                    <el-input v-model="searchForm.account" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <!-- 手机号 -->
                <el-form-item label="手机号">
                    <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>

                <!-- 课程名称 -->
                <el-form-item label="课程名称">
                    <el-input v-model="searchForm.name" placeholder="请输入课程名称"></el-input>
                </el-form-item>

                <!-- 支付状态 -->
                <el-form-item label="支付状态">
                    <el-select v-model="searchForm.state" placeholder="请选择">
                        <el-option v-for="item in searchForm.stateList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 支付方式 -->
                <el-form-item label="支付方式">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option v-for="item in searchForm.typeList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 支付日期 -->
                <el-form-item label="支付日期">
                    <el-date-picker v-model="searchForm.dateRange" format="yyyy-MM-dd" type="daterange" placeholder="选择支付日期范围">
                    </el-date-picker>
                </el-form-item>


                <el-button type="primary" icon="search" @click.native="handleSearch">搜索</el-button>
                <!-- <el-button type="primary" @click.native="resetForm('searchForm')">重置</el-button> -->
            </el-form>

            <!-- <el-button type="text"><i class="el-icon-upload el-icon-upload2"> 导出表格</i></el-button> -->
        </section>

        <section class="table-list">
            <template>
                <el-table :data="tableData" stripe fit style="width: 100%" v-loading="tableloading">
                    <el-table-column label="订单号">
                        <template scope="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="用户名">
                        <template scope="scope">{{ scope.row.account }}</template>
                    </el-table-column>
                    <el-table-column label="手机号">
                        <template scope="scope">{{ scope.row.mobile }}</template>
                    </el-table-column>
                    <el-table-column label="支付金额">
                        <template scope="scope">
                            <span v-if="scope.row.price == 0">免费</span>
                            <span v-else>{{ scope.row.price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="课程名称">
                        <template scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="支付时间">
                        <template scope="scope">{{ scope.row.time }}</template>
                    </el-table-column>
                    <el-table-column label="支付状态">
                        <template scope="scope">
                            <span v-if="scope.row.state == '已支付'">{{ scope.row.state }}</span>
                            <span class="state-orange" v-else>{{ scope.row.state }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付方式">
                        <template scope="scope">{{ scope.row.type }}</template>
                    </el-table-column>
                </el-table>
            </template>
        </section>

        <section class="pagination" v-if="!noPagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pagination.currPage"
                layout="total, prev, pager, next, jumper"
                :page-count="pagination.pagesum"
                :total="pagination.total">
            </el-pagination>
        </section>
        
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { orderList } from '../api/api';

    export default {
        data() {
            return {
                tableloading: true,
                searchForm: {
                    account: '',
                    mobile: '',
                    name: '',
                    state: '',
                    stateList: [
                        { value: '', label: '全部' },
                        { value: '0', label: '未支付' },
                        { value: '1', label: '已支付' },
                        { value: '-1', label: '支付失败' }
                    ],
                    type: '',
                    typeList: [
                        { value: '', label: '全部' },
                        { value: '1', label: '微信' },
                        { value: '2', label: '支付宝' }
                    ],
                    dateRange: ''
                },
                tableData: [],
                noPagination: false,
                pagination: {
                    currPage: 1,
                    pagesum: 1,
                    total: 0
                }
            };
        },
        methods: {
            getOrderList() {
                this.tableloading = true;

                let searchTime = '';
                if(this.searchForm.dateRange.length == 0) {
                    searchTime = '';
                } else {
                    let dateStart = new Date(this.searchForm.dateRange[0]),
                        dateEnd = new Date(this.searchForm.dateRange[1]),
                        startY = dateStart.getFullYear(),
                        startM = '',
                        startD = '',
                        endY = dateEnd.getFullYear(),
                        endM = '',
                        endD = '';

                    if(dateStart.getMonth() < 9) {
                        startM = '0' + (dateStart.getMonth() + 1);
                    } else {
                        startM = dateStart.getMonth() + 1;
                    }
                    if(dateStart.getDate() < 10) {
                        startD = '0' + dateStart.getDate();
                    } else {
                        startD = dateStart.getDate();
                    }
                    if(dateEnd.getMonth() < 9) {
                        endM = '0' + (dateEnd.getMonth() + 1);
                    } else {
                        endM = dateEnd.getMonth() + 1;
                    }
                    if(dateEnd.getDate() < 10) {
                        endD = '0' + dateEnd.getDate();
                    } else {
                        endD = dateEnd.getDate();
                    }
                    searchTime = startY +'-'+ startM +'-'+ startD +' - '+ endY +'-'+ endM +'-'+ endD;

                    if(searchTime == '1970-01-01 - 1970-01-01') {
                        searchTime = '';
                    }
                }

                let listParam = {
                    'memberName': this.searchForm.account,
                    'mobile': this.searchForm.mobile,
                    'courseName': this.searchForm.name,
                    'status': this.searchForm.state,
                    'payType': this.searchForm.type,
                    'searchTime': searchTime,
                    'pageNo': this.pagination.currPage
                };

                orderList(listParam).then(res => {
                    this.tableloading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.pagination.pagesum = data.page.totalPage;
                        this.pagination.total = data.page.totalSize;

                        if(this.pagination.pagesum === 0) {
                            this.noPagination = true;
                        } else {
                            this.noPagination = false;
                        }

                        if(data.courseOrders.length === 0) {
                            this.tableData = [];
                        } else {
                            this.tableData = [];
                            for(let i = 0; i < data.courseOrders.length; i++) {
                                let nameStr = '';
                                for(let j = 0; j < data.courseOrders[i].courseName.length; j++) {
                                    if(j < data.courseOrders[i].courseName.length - 1) {
                                        nameStr += data.courseOrders[i].courseName[j] + '、';
                                    } else {
                                        nameStr += data.courseOrders[i].courseName[j];
                                    }
                                }

                                this.tableData.push({
                                    'id': data.courseOrders[i].id,
                                    'account': data.courseOrders[i].memberName,
                                    'mobile': data.courseOrders[i].mobile,
                                    'price': data.courseOrders[i].cashFee,
                                    'name': nameStr,
                                    'time': data.courseOrders[i].createdDateString,
                                    'state': data.courseOrders[i].status,
                                    'type': data.courseOrders[i].payType
                                });
                            }
                        }
                    }
                });
            },
            // resetForm(formName) {
            //     this.$refs[formName].resetFields();
            // },
            handleSearch() {
                this.pagination.currPage = 1;
                this.getOrderList();
            },
            handleCurrentChange(val) {
                this.pagination.currPage = parseInt(val);
                this.getOrderList();
            }
        },
        mounted() {
            this.$store.state.leftnav = 'order';
            this.getOrderList();
        }
    }
</script>

<style lang="scss" scoped>
.searchbar-order{
    padding-right: 0;
    
    .el-form--inline{
        .el-form-item{
            &:nth-of-type(1){
                .el-input{
                    width: 100px;
                }
            }
            &:nth-of-type(3){
                .el-input{
                    width: 120px;
                }
            }
            &:nth-of-type(6){
                .el-input{
                    width: 190px;
                }
            }
        }

        .el-button{
            &:nth-of-type(2){
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 2px;
                padding: 0 22px;
                color: #666;
            }
        }
    }

    > .el-button{
        top: -36px;
    }
}
</style>
