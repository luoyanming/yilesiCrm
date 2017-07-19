<template>
    <div class="main-wrapper">
        <section class="crumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>课程上传</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <section class="searchbar">
            <el-form :model="searchForm" ref="searchForm" class="demo-form-inline" :inline="true">
                <!-- 课程名称 -->
                <el-form-item label="课程名称">
                    <el-input v-model="searchForm.name" placeholder="请输入课程名称"></el-input>
                </el-form-item>

                <!-- 状态 -->
                <el-form-item label="状态" prop="state">
                    <el-select v-model="searchForm.state" placeholder="请选择">
                        <el-option v-for="item in searchForm.stateList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 价格 -->
                <el-form-item label="价格" prop="price">
                    <el-select v-model="searchForm.price" placeholder="请选择">
                        <el-option v-for="item in searchForm.priceList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 学段 -->
                <el-form-item label="学段" prop="period">
                    <el-select v-model="searchForm.period" placeholder="请选择" @change="selectPeriod">
                        <el-option v-for="item in searchForm.periodList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 年级 -->
                <el-form-item label="年级" prop="grade" v-show="!!searchForm.period">
                    <el-select v-model="searchForm.grade" placeholder="请选择" @change="selectGrade">
                        <el-option v-for="item in searchForm.gradeList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 学科 -->
                <el-form-item label="学科" prop="subject" v-show="!!searchForm.grade">
                    <el-select v-model="searchForm.subject" placeholder="请选择">
                        <el-option v-for="item in searchForm.subjectList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-button type="primary" icon="search" @click.native="handleSearch">搜索</el-button>
            </el-form>

            <el-button type="primary" @click.native="linkToAdd">新增<i class="el-icon-upload el-icon--right"></i></el-button>
        </section>

        <section class="table-list">
            <template>
                <el-table :data="tableData" stripe fit style="width: 100%" v-loading="tableloading">
                    <el-table-column label="ID">
                        <template scope="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="课程名称">
                        <template scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="学段">
                        <template scope="scope">{{ scope.row.period }}</template>
                    </el-table-column>
                    <el-table-column label="年级">
                        <template scope="scope">{{ scope.row.grade }}</template>
                    </el-table-column>
                    <el-table-column label="学科">
                        <template scope="scope">{{ scope.row.subject }}</template>
                    </el-table-column>
                    <el-table-column label="价格(元)">
                        <template scope="scope">{{ scope.row.price }}</template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template scope="scope">
                            <span class="state-orange" v-if="scope.row.state == '未上架'">{{ scope.row.state }}</span>
                            <span v-else>{{ scope.row.state }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="标签">
                        <template scope="scope">{{ scope.row.tags }}</template>
                    </el-table-column>
                    <el-table-column label="录入时间">
                        <template scope="scope">{{ scope.row.time }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="text" @click="btnChaneState(1, scope.row.id, scope.$index)" v-if="scope.row.stateType == 0">上架</el-button>
                            <el-button type="text" @click="btnChaneState(0, scope.row.id, scope.$index)" v-if="scope.row.stateType == 1">下架</el-button>
                            <el-button type="text" @click="btnEdit(scope.row.id)">编辑</el-button>
                            <el-button type="text" @click="btnDetail(scope.row.id)">查看</el-button>
                        </template>
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
    import { courseList, updateCourseStatus } from '../api/api';
    const catalogJson = require('../common/catalog.json');

    export default {
        data() {
            return {
                tableloading: true,
                searchForm: {
                    name: '',
                    state: '',
                    stateList: [
                        { value: '', label: '全部' },
                        { value: '0', label: '未上架' },
                        { value: '1', label: '已上架' }
                    ],
                    price: '',
                    priceList: [
                        { value: '', label: '全部' },
                        { value: '0', label: '免费' },
                        { value: '1', label: '收费' }
                    ],
                    period: '',
                    periodList: [],
                    grade: '',
                    gradeList: [],
                    subject: '',
                    subjectList: []
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
            getPeriodList() {
                this.searchForm.periodList.push({
                    'value': '',
                    'label': '全部'
                });
                for(let i = 0; i < catalogJson.catalog.length; i++) {
                    this.searchForm.periodList.push({
                        'value': catalogJson.catalog[i].id,
                        'label': catalogJson.catalog[i].name
                    });
                }
            },
            selectPeriod(val) {
                this.searchForm.grade = '';
                this.searchForm.gradeList = [];
                this.searchForm.subject = '';
                this.searchForm.subjectList = [];

                if(val == '') {
                    return false;
                }

                this.searchForm.gradeList.push({
                    'value': '',
                    'label': '全部'
                });

                let periodIndex;
                for(let i = 0; i < this.searchForm.periodList.length; i++) {
                    if(this.searchForm.periodList[i].value == val) {
                        periodIndex = i - 1;
                    }
                }

                let gradeList = catalogJson.catalog[periodIndex].sub;
                for(let i = 0; i < gradeList.length; i++) {
                    this.searchForm.gradeList.push({
                        'value': gradeList[i].id,
                        'label': gradeList[i].name
                    });
                }
            },
            selectGrade(val) {
                this.searchForm.subject = '';
                this.searchForm.subjectList = [];

                if(val == '') {
                    return false;
                }
                
                this.searchForm.subjectList.push({
                    'value': '',
                    'label': '全部'
                });

                let periodIndex;
                for(let i = 0; i < this.searchForm.periodList.length; i++) {
                    if(this.searchForm.periodList[i].value == this.searchForm.period) {
                        periodIndex = i - 1;
                    }
                }

                let gradeIndex;
                for(let i = 0; i < this.searchForm.gradeList.length; i++) {
                    if(this.searchForm.gradeList[i].value == this.searchForm.grade) {
                        gradeIndex = i - 1;
                    }
                }

                let subjectList = catalogJson.catalog[periodIndex].sub[gradeIndex].sub;
                for(let i = 0; i < subjectList.length; i++) {
                    this.searchForm.subjectList.push({
                        'value': subjectList[i].id,
                        'label': subjectList[i].name
                    });
                }
            },
            // 获取课程列表
            getCourseList() {
                this.tableloading = true;

                let listParam = {
                    'courseName': this.searchForm.name,
                    'status': this.searchForm.state,
                    'priceType': this.searchForm.price,
                    'periodId': this.searchForm.period,
                    'gradeId': this.searchForm.grade,
                    'subjectId': this.searchForm.subject,
                    'pageNo': this.pagination.currPage
                };

                courseList(listParam).then(res => {
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

                        if(data.courseAdminVos.length === 0) {
                            this.tableData = [];
                        } else {
                            this.tableData = [];
                            for(let i = 0; i < data.courseAdminVos.length; i++) {
                                let tagStr = '';
                                if(data.courseAdminVos[i].tags.length > 0) {
                                    for(let j = 0; j < data.courseAdminVos[i].tags.length; j++) {
                                        if(j < data.courseAdminVos[i].tags.length - 1) {
                                            tagStr += data.courseAdminVos[i].tags[j] + '、';
                                        } else {
                                            tagStr += data.courseAdminVos[i].tags[j];
                                        }
                                    }
                                }

                                this.tableData.push({
                                    'id': data.courseAdminVos[i].id,
                                    'name': data.courseAdminVos[i].courseName,
                                    'period': data.courseAdminVos[i].period,
                                    'grade': data.courseAdminVos[i].grade,
                                    'subject': data.courseAdminVos[i].subject,
                                    'price': data.courseAdminVos[i].priceString,
                                    'state': data.courseAdminVos[i].status,
                                    'stateType': data.courseAdminVos[i].statusInt,
                                    'tags': tagStr,
                                    'time': data.courseAdminVos[i].createdDateString
                                });
                            }
                        }
                    }
                });
            },
            handleCurrentChange(val) {
                this.pagination.currPage = parseInt(val);
                this.getCourseList();
            },
            handleSearch() {
                this.pagination.currPage = 1;
                this.getCourseList();
            },
            // 上、下架
            btnChaneState(type, id, index) {
                console.log(index)
                let str = '';
                if(type == 0) {
                    str = '确定下架？';
                } else if(type == 1) {
                    str = '确定上架？';
                }

                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let updateCourseStatusParam = { 'status': type, 'courseId': id };

                    updateCourseStatus(updateCourseStatusParam).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            if(type == 0) {
                                this.$message({ message: '下架成功', type: 'success'});
                                this.tableData[index].state = '未上架';
                                this.tableData[index].stateType = 0;
                            } else if(type == 1) {
                                this.$message({ message: '上架成功', type: 'success'});
                                this.tableData[index].state = '已上架';
                                this.tableData[index].stateType = 1;
                            }
                        }
                    });

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                            
                });
            },
            // 编辑
            btnEdit(id) {
                this.$router.push({ path: '/course/create', query: { id: id } });
            },
            // 查看详情
            btnDetail(id) {
                this.$router.push({ path: '/course/detail', query: { id: id } });
            },
            linkToAdd() {
                this.$router.push({ path: '/course/create' });
            }
        },
        mounted() {
            this.$store.state.leftnav = 'course';
            this.getPeriodList();
            this.getCourseList();
        }
    }
</script>

<style lang="scss">
    
</style>
