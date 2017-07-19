<template>
    <div class="main-wrapper">
        <section class="crumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/course' }">课程上传</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!courseID">新增课程</el-breadcrumb-item>
                <el-breadcrumb-item v-else>编辑课程</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <div class="course-form" v-loading="courseLoading">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="200px" class="demo-ruleForm">
                <!-- 课程名称 -->
                <el-form-item label="课程名称" prop="name">
                    <div style="width: 300px;">
                        <el-input v-model="addForm.name"></el-input>
                    </div>
                </el-form-item>

                <!-- 课程价格 -->
                <el-form-item label="课程价格" prop="priceType">
                    <el-radio-group v-model="addForm.priceType">
                        <el-radio-button label="0">免费</el-radio-button>
                        <el-radio-button label="1">付费</el-radio-button>
                    </el-radio-group>
                    <div class="price-wrap" v-if="addForm.priceType == '1'">
                        <div style="display:inline-block; width: 80px">
                            <el-input v-model="addForm.price"></el-input>
                        </div>
                        <p class="type-tips">元 <span>（保留2位小数）</span></p>
                    </div>
                </el-form-item>

                <!-- 学段 -->
                <el-form-item label="学段" prop="period">
                    <el-radio-group v-model="addForm.period" @change="selectPeriod">
                        <el-radio-button v-for="item in addForm.periodList" :label="item.value">{{ item.label }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <!-- 年级 -->
                <el-form-item label="年级" prop="grade" v-show="!!addForm.period">
                    <el-radio-group v-model="addForm.grade" @change="selectGrade">
                        <el-radio-button v-for="item in addForm.gradeList" :label="item.value">{{ item.label }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <!-- 学科 -->
                <el-form-item label="学科" prop="subject" v-show="!!addForm.grade">
                    <el-select v-model="addForm.subject" placeholder="请选择">
                        <el-option v-for="item in addForm.subjectList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 教材版本 -->
                <el-form-item label="教材版本">
                    <el-select v-model="addForm.bookVersion" placeholder="请选择">
                        <el-option v-for="item in addForm.bookVersionList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
                <!-- 课程类型 -->
                <el-form-item label="课程类型" prop="category">
                    <el-select v-model="addForm.category" placeholder="请选择">
                        <el-option v-for="item in addForm.categoryList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
                <!-- 课程标签(可多选) -->
                <el-form-item label="课程标签(可多选)" prop="tags">
                    <el-checkbox-group v-model="addForm.tags">
                        <el-checkbox v-for="item in addForm.tagsList" :label="item.value">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- 课程介绍 -->
                <el-form-item label="课程介绍" prop="descrip">
                    <el-input type="textarea" v-model="addForm.descrip" placeholder="请输入课程介绍，最多不超多1000字"></el-input>
                </el-form-item>

                <!-- 适用人群 -->
                <el-form-item label="适用人群" prop="crowd">
                    <div style="width: 200px">
                        <el-input v-model="addForm.crowd"></el-input>
                    </div>
                </el-form-item>

                <!-- 作者 -->
                <el-form-item label="作者" prop="author">
                    <div style="width: 200px">
                        <el-input v-model="addForm.author"></el-input>
                    </div>
                </el-form-item>

                <!-- 课程封面 -->
                <el-form-item label="课程封面" v-bind:class="{'upload-cover': true}" prop="coverList">
                    <el-upload
                        class="upload-demo"
                        action="/privateapi/course/uploadFiles"
                        :data="{ 'customType': '1' }"
                        :file-list="addForm.coverList"
                        :disabled="this.addForm.coverList.length != 0"
                        :before-upload="uploadBefore"
                        :on-success="uploadCoverSucc"
                        :on-error="uploadError"
                        :on-remove="uploadCoverRemove"
                        list-type="picture">
                        <el-button size="" type="primary" :disabled="this.addForm.coverList.length != 0">选择图片</el-button>
                    </el-upload>
                    <p class="upload-tips">只能上传jpg/png文件，且尺寸为750*340</p>
                </el-form-item>

                <!-- 课程截图 -->
                <el-form-item label="课程截图" v-bind:class="{'upload-screenshot': true}" prop="screenshot">
                    <el-upload
                        class="upload-demo"
                        action="/privateapi/course/uploadFiles"
                        :data="{ 'customType': '1' }"
                        :file-list="addForm.screenshot"
                        :disabled="this.addForm.screenshot.length > 3"
                        :before-upload="uploadBefore"
                        :on-success="uploadScreenSucc"
                        :on-error="uploadError"
                        :on-remove="uploadScreenRemove"
                        list-type="picture">
                        <el-button size="" type="primary" :disabled="this.addForm.screenshot.length > 3">选择图片</el-button>
                    </el-upload>
                    <p class="upload-tips">只能上传jpg/png文件，且尺寸为330*150，最多可添加4张</p>
                </el-form-item>

                <!-- 课程目录 -->
                <el-form-item label="课程目录" prop="catalog">
                    <div class="catalog-box">
                        <!-- 一级 start -->
                        <article class="catalog-level-one" v-for="(item, index) in addForm.catalog">
                            <table class="table-one" cellpadding="0" cellspacing="0">
                                <thead>
                                    <tr>
                                        <td>目录名称</td>
                                        <td>类型</td>
                                        <td>文件名称或链接</td>
                                        <td>状态</td>
                                        <td>操作</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="4">{{ item.title }}</td>
                                        <td>
                                            <el-button type="text" @click.native="btnEditCatalogOne(index)">重命名</el-button>
                                            <el-button type="text" @click.native="btnDelCatalogOne(index)">删除</el-button>
                                        </td>
                                    </tr>
                                    <!-- 二级 start -->
                                    <tr v-for="(subitem, subindex) in item.list">
                                        <td>{{ subitem.title }}</td>
                                        <td v-if="subitem.fileType == '1'">音频</td>
                                        <td v-if="subitem.fileType == '3'">视频</td>
                                        <td v-if="subitem.fileType == '2'">文档</td>
                                        <td v-if="subitem.fileType == '0'"></td>
                                        <td>{{ subitem.fileName }}</td>
                                        <td class="state-orange" v-if="subitem.uploadStatus == '1'">正在上传</td>
                                        <td class="state-green" v-if="subitem.uploadStatus == '2'">上传成功</td>
                                        <td class="state-red" v-if="subitem.uploadStatus == '-1'">上传失败</td>
                                        <td class="state-red" v-if="subitem.uploadStatus == '0'"></td>
                                        <td>
                                            <el-button type="text" @click.native="btnEditCatalogTwo(index, subindex)">重命名</el-button>
                                            <el-button type="text" @click.native="btnDelCatalogTwo(index, subindex)">删除</el-button>
                                        </td>
                                    </tr>
                                    <!-- 二级 end -->
                                </tbody>
                            </table>
                            <div class="btn-add-two">
                                <el-button type="text" icon="plus" @click.native="btnAddCatalogTwo(index)">添加二级目录</el-button>
                            </div>
                        </article>
                        <!-- 一级 end -->

                        <div class="btn-add-one">
                            <el-button type="text" icon="plus" @click.native="btnAddCatalogOne">添加一级目录</el-button>
                        </div>
                    </div>
                </el-form-item>
                
                <!-- 上传按钮 -->
                <el-form-item>
                    <el-button type="primary" v-bind:class="{'btn-form-cancle': true}" @click="linkToList">放弃编辑</el-button>
                    <el-button type="primary" v-bind:class="{'btn-form-ensure': true}" @click="onSubmit" :loading="onSubmitloading">上传课程</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { courseAddTypes, courseDetail, courseModify, uploadFiles } from '../api/api';
    const catalogJson = require('../common/catalog.json');

    export default {
        data() {
            var checkPrice = (rule, value, callback) => {
                if(this.addForm.priceType == '0') {
                    this.addForm.price = '0.00';
                    callback();
                } else if(this.addForm.priceType == '1') {
                    if(this.addForm.price == '') {
                        callback(new Error('请输入课程价格'));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error('请选择课程价格'));
                }
            }
            return {
                courseID: this.$route.query.id,
                courseLoading: true,
                onSubmitloading: false,
                radioValue: {
                    periodId: '',
                    gradeId: '',
                    subjectId: ''
                },
                addForm: {
                    name: '',
                    priceType: '',
                    price: '',
                    period: '',
                    periodList: [],
                    grade: '',
                    gradeList: [],
                    subject: '',
                    subjectList: [],
                    bookVersion: '',
                    bookVersionList: [],
                    category: '',
                    categoryList: [],
                    tags: [],
                    tagsList: [],
                    descrip: '',
                    crowd: '',
                    author: '',
                    coverList: [],
                    screenshot: [],
                    catalog: []
                },
                addFormRules: {
                    name: [
                        { required: true, message: '请输入课程名称', trigger: 'blur' }
                    ],
                    priceType: [
                        { required: true, type: 'number', message: '请输入课程价格', trigger: 'change', validator: checkPrice }
                    ],
                    period: [
                        { required: true, type: 'number', message: '请选择学段', trigger: 'change' }
                    ],
                    grade: [
                        { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
                    ],
                    subject: [
                        { required: true, type: 'number', message: '请选择学科', trigger: 'change' }
                    ],
                    category: [
                        { required: true, type: 'number', message: '请选择课程类型', trigger: 'change' }
                    ],
                    tags: [
                        { required: true, type: 'array', message: '请选择课程标签', trigger: 'change' }
                    ],
                    descrip: [
                        { required: true, message: '请输入课程介绍', trigger: 'blur' }
                    ],
                    crowd: [
                        { required: true, message: '请输入适用人群', trigger: 'blur' }
                    ],
                    coverList: [
                        { required: true, type: 'array', message: '请上传课程封面', trigger: 'change' }
                    ],
                    catalog: [
                        { required: true, type: 'array', message: '请添加课程目录', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            init() {
                this.getPeriodList();
                this.getAddTypesList();
            },
            getPeriodList() {
                for(let i = 0; i < catalogJson.catalog.length; i++) {
                    this.addForm.periodList.push({
                        'value': catalogJson.catalog[i].id,
                        'label': catalogJson.catalog[i].name
                    });
                }
            },
            selectPeriod(val) {
                this.addForm.grade = '';
                this.addForm.gradeList = [];
                this.addForm.subject = '';
                this.addForm.subjectList = [];

                let periodIndex;
                for(let i = 0; i < this.addForm.periodList.length; i++) {
                    if(this.addForm.periodList[i].value == val) {
                        periodIndex = i;
                    }
                }

                let gradeList = catalogJson.catalog[periodIndex].sub;
                for(let i = 0; i < gradeList.length; i++) {
                    this.addForm.gradeList.push({
                        'value': gradeList[i].id,
                        'label': gradeList[i].name
                    });
                }

                this.addForm.grade = this.radioValue.gradeId;
            },
            selectGrade(val) {
                this.addForm.subject = '';
                this.addForm.subjectList = [];

                let periodIndex;
                for(let i = 0; i < this.addForm.periodList.length; i++) {
                    if(this.addForm.periodList[i].value == this.addForm.period) {
                        periodIndex = i;
                    }
                }

                let gradeIndex;
                for(let i = 0; i < this.addForm.gradeList.length; i++) {
                    if(this.addForm.gradeList[i].value == this.addForm.grade) {
                        gradeIndex = i;
                    }
                }

                let subjectList = catalogJson.catalog[periodIndex].sub[gradeIndex].sub;
                for(let i = 0; i < subjectList.length; i++) {
                    this.addForm.subjectList.push({
                        'value': subjectList[i].id,
                        'label': subjectList[i].name
                    });
                }

                this.addForm.subject = this.radioValue.subjectId;
            },
            getAddTypesList() {
                courseAddTypes({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.getCategoryTagsList();
                    } else {
                        for(let i = 0; i < data.courseType.length; i++) {
                            this.addForm.categoryList.push({
                                'value': data.courseType[i].id,
                                'label': data.courseType[i].name
                            });
                        }
                        for(let i = 0; i < data.version.length; i++) {
                            this.addForm.bookVersionList.push({
                                'value': data.version[i].id,
                                'label': data.version[i].name
                            });
                        }
                        for(let i = 0; i < data.tags.length; i++) {
                            this.addForm.tagsList.push({
                                'value': data.tags[i].id,
                                'label': data.tags[i].name
                            });
                        }

                        this.getCourseDetail();
                    }
                });
            },
            // 编辑时获取详情
            getCourseDetail() {
                if(this.courseID) {
                    let courseDetailParam = { courseId: this.courseID };

                    courseDetail(courseDetailParam).then(res => {
                        let { code, msg, data} = res;

                        if(code !== 0) {
                            this.getCourseDetail();
                        } else {
                            this.addForm.name = data.courseAdminDetailVo.name;
                            this.addForm.priceType = data.courseAdminDetailVo.priceType;
                            this.addForm.price = data.courseAdminDetailVo.price;
                            this.addForm.period = data.courseAdminDetailVo.periodId;
                            this.radioValue.periodId = data.courseAdminDetailVo.periodId;
                            this.addForm.grade = data.courseAdminDetailVo.gradeId;
                            this.radioValue.gradeId = data.courseAdminDetailVo.gradeId;
                            this.addForm.subject = data.courseAdminDetailVo.subjectId;
                            this.radioValue.subjectId = data.courseAdminDetailVo.subjectId;
                            this.addForm.bookVersion = parseInt(data.courseAdminDetailVo.version);
                            this.addForm.category = data.courseAdminDetailVo.courseTypeID;

                            let tagsArr = [];
                            for(let i = 0; i < data.courseAdminDetailVo.tags.length; i++){
                                tagsArr[i] = parseInt(data.courseAdminDetailVo.tags[i].id);
                            }
                            this.addForm.tags = tagsArr;

                            this.addForm.descrip = data.courseAdminDetailVo.describe;
                            this.addForm.crowd = data.courseAdminDetailVo.fitPerson;
                            this.addForm.author = data.courseAdminDetailVo.author;
                            this.addForm.coverList = [
                                {
                                    'url': data.courseAdminDetailVo.picUrl
                                }
                            ];
                            this.addForm.screenshot = data.courseAdminDetailVo.screenshotVoList;
                            this.addForm.catalog = data.courseAdminDetailVo.courseCatalogVoList;

                            this.courseLoading = false;
                        }
                    });
                } else {
                    this.courseLoading = false;
                    return false;
                }
            },
            // 添加一级目录
            btnAddCatalogOne() {
                this.$prompt('请输入一级目录名称', '添加一级目录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /([^x00-xff]|(?:\.[\w!#$%&'*+/=?^_`{|}~-]+))+/,
                    inputErrorMessage: '请填写目录名称'
                }).then(({ value }) => {
                    this.addForm.catalog.push({
                        'id': '',
                        'title': value,
                        'list': []
                    });
                }).catch(() => {
                      
                });
            },
            // 重命名一级目录
            btnEditCatalogOne(index) {
                this.$prompt('请重新输入一级目录名称', '重命名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: this.addForm.catalog[index].title,
                    inputPattern: /([^x00-xff]|(?:\.[\w!#$%&'*+/=?^_`{|}~-]+))+/,
                    inputErrorMessage: '请重新输入一级目录名称'
                }).then(({ value }) => {
                    this.addForm.catalog[index].title = value;
                }).catch(() => {
                      
                });
            },
            // 删除一级目录
            btnDelCatalogOne(index) {
                this.$confirm('删除此一级目录，将目录下的二级目录同时将被删除，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addForm.catalog.splice(index, index + 1);

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                            
                });
            },
            // 添加二级目录
            btnAddCatalogTwo(index) {
                this.$prompt('请输入二级目录名称', '添加二级目录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /([^x00-xff]|(?:\.[\w!#$%&'*+/=?^_`{|}~-]+))+/,
                    inputErrorMessage: '请填写目录名称'
                }).then(({ value }) => {
                    this.addForm.catalog[index].list.push({
                        'id': '',
                        'title': value,
                        'superId': this.addForm.catalog[index].id,
                        'fileType': 0,
                        'uploadType': 0,
                        'url': '',
                        'fileName': '',
                        'uploadStatus': 0
                    });
                }).catch(() => {
                     
                });
            },
            // 重命名二级目录
            btnEditCatalogTwo(index, subindex) {
                this.$prompt('请重新输入二级目录名称', '重命名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: this.addForm.catalog[index].list[subindex].title,
                    inputPattern: /([^x00-xff]|(?:\.[\w!#$%&'*+/=?^_`{|}~-]+))+/,
                    inputErrorMessage: '请重新输入二级目录名称'
                }).then(({ value }) => {
                    this.addForm.catalog[index].list[subindex].title = value;
                }).catch(() => {
                      
                });
            },
            // 删除二级目录
            btnDelCatalogTwo(index, subindex) {
                this.$confirm('删除此二级目录，将同时删除改目录下已经上传的文件，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addForm.catalog[index].list.splice(subindex, subindex + 1);

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                            
                });
            },
            uploadBefore(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '上传图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadCoverSucc(response, file, fileList) {
                this.addForm.coverList = fileList;
            },
            uploadCoverRemove(file, fileList) {
                this.addForm.coverList = fileList;
            },
            uploadScreenSucc(response, file, fileList) {
                this.addForm.screenshot = fileList;
            },
            uploadError(response, file, fileList) {
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            uploadScreenRemove(file, fileList) {
                this.addForm.screenshot = fileList;
            },
            // 提交
            onSubmit() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.onSubmitloading = true;

                        let courseModifyParam = {
                            'courseId': this.courseID,
                            'type': 1,
                            'courseName': this.addForm.name,
                            'priceType': this.addForm.priceType,
                            'price': this.addForm.price,
                            'periodId': this.addForm.period,
                            'gradeId': this.addForm.grade,
                            'subjectId': this.addForm.subject,
                            'version': this.addForm.bookVersion,
                            'courseType': this.addForm.category,
                            'tagsJson': [],
                            'describe': this.addForm.descrip,
                            'fitPerson': this.addForm.crowd,
                            'author': this.addForm.author,
                            'picUrl': '',
                            'screenPicUrlsJson': [],
                            'catalogsJson': JSON.stringify(this.addForm.catalog)
                        };

                        // 1: 新增； 2：编辑；
                        let modifyType = '';
                        if(this.courseID) {
                            modifyType = 2;
                        } else {
                            modifyType = 1;
                        }
                        courseModifyParam.type = modifyType;

                        // 课程标签
                        let tagsArr = [];
                        for(let i = 0; i < this.addForm.tags.length; i++) {
                            tagsArr.push({ 'id': this.addForm.tags[i] });
                        }
                        courseModifyParam.tagsJson = JSON.stringify(tagsArr);

                        // 封面
                        if(this.addForm.coverList[0].response) {
                            courseModifyParam.picUrl = this.addForm.coverList[0].response.data.url;
                        } else {
                            courseModifyParam.picUrl = this.addForm.coverList[0].url;
                        }

                        // 截图
                        let screenArr = [];
                        for(let i = 0; i < this.addForm.screenshot.length; i++) {
                            if(this.addForm.screenshot[i].response) {
                                screenArr.push({ 'picUrlSource': this.addForm.screenshot[i].response.data.url });
                            } else {
                                screenArr.push({ 'picUrlSource': this.addForm.screenshot[i].url });
                            }
                        }
                        courseModifyParam.screenPicUrlsJson = JSON.stringify(screenArr);

                        courseModify(courseModifyParam).then(res => {
                            this.onSubmitloading = false;

                            let { msg, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '保存成功', type: 'success'});
                                this.$router.push({ path: '/course' });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            linkToList() {
                this.$router.push({ path: '/course' });
            }
        },
        mounted() {
            this.$store.state.leftnav = 'course';
            this.init();
        }
    }
</script>

<style lang="scss">
    .course-form{
        .el-form-item__label{
            font-size: 12px;
            color: #666;
            line-height: 40px;
            padding: 0 20px 0 0;
        }
        .el-form-item.is-required .el-form-item__label:before {
            margin-right: 6px;
        }

        .el-input__inner,
        .el-textarea__inner{
            border-radius: 2px;
            border: 1px solid #E5E5E5;
        }

        .el-form{
            .el-form-item{
                .el-form-item__content{
                    position: relative;
                }

                .price-wrap{
                    display: inline-block;
                    position: relative;
                    top: 4px;
                    margin-left: 15px;
                }

                .el-input{
                    .el-input__inner{
                        border-radius: 2px;
                        border: 1px solid #E5E5E5;
                        font-size: 12px;
                        color: #333;
                        height: 42px;

                        &:hover{
                            border-color: rgb(131, 165, 162);
                        }

                        &:focus{
                            border-color: #18c79c;
                        }
                    }
                }

                .el-textarea{
                    max-width: 680px;
                    .el-textarea__inner{
                        border-radius: 2px;
                        border: 1px solid #E5E5E5;
                        font-size: 12px;
                        color: #333;
                        padding: 7px 10px;
                        min-height: 100px;
                            
                        &:hover{
                            border-color: rgb(131, 165, 162);
                        }

                        &:focus{
                            border-color: #18c79c;
                        }
                    }
                }

                &.is-error{
                    .el-input{
                        .el-input__inner{
                            border-color: #ff4949;
                        }
                    }
                    .el-textarea{
                        .el-textarea__inner{
                            border-color: #ff4949;
                        }
                    }
                }

                .el-radio-button{
                    .el-radio-button__inner{
                        font-size: 12px;
                        color: #666;
                        padding: 0 22px;
                        line-height: 40px;
                        border: 1px solid #E5E5E5;
                        border-left: 0;

                        &:hover{
                            color: #18c79c;
                        }
                    }

                    &:first-child{
                        .el-radio-button__inner{
                            border-left: 1px solid #E5E5E5;
                            border-radius: 3px 0 0 3px;
                        }
                    }
                }

                .el-radio-button__orig-radio:checked+.el-radio-button__inner{
                        color: #fff;
                        background-color: #18c79c;
                        border-color: #18c79c;
                        box-shadow: -1px 0 0 0 #18c79c;
                }

                .el-select .el-input .el-input__icon{
                    color: #EBEBEB;
                }
            }
        }

        .el-row{
            .el-col{
                font-size: 0;
            }
        }
        
        .upload-demo{
            font-size: 0;
            .el-upload{
                font-size: 0;
                
                .el-button{
                    padding: 0 24px;
                    height: 40px;
                }
            }

            .el-upload-list--picture{
                display: block;

                .el-upload-list__item{
                    width: 420px;
                    height: 70px;
                    background: #FFFFFF;
                    border: 1px solid #E5E5E5;
                    border-radius: 2px;

                    .el-upload-list__item-name{
                        display: inline-block;
                        line-height: 50px;
                        font-size: 12px;
                        color: #999;
                        margin: 0;

                        .el-icon-document{
                            font-size: 50px;
                        }
                    }

                    .el-icon-close{
                        position: absolute;
                        z-index: 3;
                        right: 15px;
                        top: 50%;
                        -webkit-transform: translate3d(0, -50%, 0);
                                transform: translate3d(0, -50%, 0);
                    }

                    .el-progress{
                        position: absolute;
                        width: 60%;
                        bottom: 10px;

                        .el-progress__text{
                            top: 2px;
                            right: -40px;
                        }
                    }
                }
            }
        }

        .el-upload-list__item-thumbnail{
            width: auto;
            height: 50px;
        }

        .upload-tips{
            position: absolute;
            z-index: 3;
            top: 0;
            left: 140px;
            font-size: 12px;
            color: #999;
            line-height: 40px;
        }

        .type-tips{
            display: inline-block;
            margin-left: 8px;
            font-size: 12px;
            color: #666;

            span{
                color: #999;
            }
        }

        .btn-form-cancle,
        .btn-form-ensure{
            width: 180px;
            height: 52px;
            font-size: 18px;

            &.btn-small{
                width: 120px;
            }
        }

        .btn-form-cancle{
            background: #ffffff;
            border: 1px solid #E5E5E5;
            border-radius: 2px;
            color: #333;
        }

        .btn-form-ensure{
            background: #18c79c;
            border: 1px solid #18c79c;
            border-radius: 2px;
        }
    }

    .el-select-dropdown__item{
        font-size: 12px;
    }

    .el-checkbox__inner{
        border: 1px solid #E5E5E5;
    }
    .el-checkbox__label{
        font-size: 12px;
        color: #666;
    }

    .el-input-group__prepend{
        width: 60px;
        font-size: 12px;
        color: #666;
        background: #F9FAFC !important;
        border: 1px solid #E5E5E5;
        border-right: none;
        border-radius: 2px 0 0 2px;
        text-align: center;
    }


    /* catalog-box */
    .catalog-box{
        .catalog-level-one{
            width: 680px;
            margin-bottom: 20px;
            background: #FFFFFF;
            box-shadow: 0 1px 4px 0 rgba(65,86,105,0.20);

            .table-one{
                width: 100%;

                thead{
                    tr{
                        background: #F1F2F4;

                        td{
                            line-height: 40px;
                            font-size: 12px;
                            color: #333;

                            &:nth-of-type(1){
                                width: 250px;
                                padding-left: 20px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(2){
                                width: 90px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(3){
                                width: 250px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(4){
                                width: 100px;
                                padding-right: 20px;
                            }
                            &:nth-of-type(5){
                                width: 100px;
                                padding-right: 20px;
                            }
                        }
                    }
                }

                tbody{
                    tr{
                        background: #FFFFFF;
                        box-shadow: inset 0 -1px 0 0 #E5E5E5;

                        td{
                            padding-top: 10px;
                            padding-bottom: 10px;
                            font-size: 12px;
                            color: #666;
                            line-height: 30px;

                            .el-button{
                                font-size: 12px;
                            }

                            &:nth-of-type(1){
                                width: 250px;
                                padding-left: 20px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(2){
                                width: 90px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(3){
                                width: 250px;
                                padding-right: 10px;
                            }
                            &:nth-of-type(4){
                                width: 100px;
                                padding-right: 20px;
                            }
                            &:nth-of-type(5){
                                width: 100px;
                                padding-right: 20px;
                            }
                        }

                        &:first-child{
                            background: #F9FAFC;

                            td{
                                font-size: 14px;
                                color: #333;
                            }
                        }
                    }
                }
            }

            .btn-add-two{
                padding: 8px 0;
                text-align: center;
                background: #F9FAFC;

                .el-button{
                    .el-icon-plus{
                        font-size: 8px;
                    }

                    span{
                        font-size: 12px;
                    }
                }
            }
        }

        .btn-add-one{
            .el-button{
                .el-icon-plus{
                    font-size: 8px;
                }

                span{
                    font-size: 12px;
                }
            }
        }
    }
</style>
