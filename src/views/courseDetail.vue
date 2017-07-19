<template>
    <div class="main-wrapper">
        <section class="crumb">
            <el-breadcrumb separator="/" v-show="!showCatalogTwo">
                <el-breadcrumb-item :to="{ path: '/course' }">课程上传</el-breadcrumb-item>
                <el-breadcrumb-item>课程详情</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator="/" v-show="showCatalogTwo">
                <el-breadcrumb-item :to="{ path: '/course' }">课程上传</el-breadcrumb-item>
                <el-breadcrumb-item @click.native="showCatalogTwo = !showCatalogTwo">课程详情</el-breadcrumb-item>
                <el-breadcrumb-item>添加二级目录</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <div class="course-form" v-show="!showCatalogTwo">
            <!-- <el-form :model="addForm" ref="addForm" label-width="200px" class="demo-ruleForm"> -->
            <el-form label-width="200px" class="demo-ruleForm">
                <el-form-item label="课程名称">
                    <p class="text">{{ detail.name }}</p>
                </el-form-item>

                <el-form-item label="课程ID">
                    <p class="text">{{ detail.id }}</p>
                </el-form-item>

                <el-form-item label="状态">
                    <p class="text state-orange" v-if="detail.status == 0">未上架</p>
                    <p class="text" v-if="detail.status == 1">已上架</p>
                </el-form-item>

                <el-form-item label="录入时间">
                    <p class="text">{{ detail.createDateString }}</p>
                </el-form-item>

                <el-form-item label="课程价格">
                    <p class="text">{{ detail.price }}</p>
                </el-form-item>

                <el-form-item label="学段">
                    <p class="text">{{ detail.periodName }}</p>
                </el-form-item>

                <el-form-item label="年级">
                    <p class="text">{{ detail.gradeName }}</p>
                </el-form-item>

                <el-form-item label="学科">
                    <p class="text">{{ detail.subjectName }}</p>
                </el-form-item>

                <el-form-item label="教材版本">
                    <p class="text">{{ detail.version }}</p>
                </el-form-item>

                <el-form-item label="课程类型">
                    <p class="text">{{ detail.courseType }}</p>
                </el-form-item>

                <el-form-item label="课程标签(可多选)">
                    <p class="text">
                        <span style="margin-right:10px;" v-for="item in detail.tags">{{ item.name }}</span>
                    </p>
                </el-form-item>

                <el-form-item label="课程简介">
                    <p class="text">{{ detail.describe }}</p>
                </el-form-item>

                <el-form-item label="适用人群">
                    <p class="text">{{ detail.fitPerson }}</p>
                </el-form-item>

                <el-form-item label="作者">
                    <p class="text">{{ detail.author }}</p>
                </el-form-item>
                
                <!-- detail.picurl -->
                <el-form-item label="课程封面">
                    <img :src="detail.picUrl" class="pic">
                </el-form-item>

                <!-- detail.screenshotVoList -->
                <el-form-item label="课程截图">
                    <img v-for="item in detail.screenshotVoList" :src="item.url" class="pic">
                </el-form-item>

                <!-- 课程目录 -->
                <el-form-item label="课程目录" prop="catalog">
                    <div class="catalog-box">
                        <!-- 一级 start -->
                        <article class="catalog-level-one" v-for="(item, index) in detail.courseCatalogVoList">
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
                                        <td colspan="5">{{ item.title }}</td>
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
                                            <el-button type="text" v-if="subitem.fileType == ''" @click.native="btnAddCatalogTwo(index, subindex)">上传内容</el-button>
                                            <el-button type="text" v-if="subitem.fileType != ''" @click.native="btnEditCatalogTwo(index, subindex)">编辑内容</el-button>
                                        </td>
                                    </tr>
                                    <!-- 二级 end -->
                                </tbody>
                            </table>
                        </article>
                        <!-- 一级 end -->
                    </div>
                </el-form-item>
                
                <!-- 上传按钮 -->
                <el-form-item>
                    <el-button type="primary" v-bind:class="{'btn-form-cancle': true}" @click="linkToList">返回列表</el-button>
                    <el-button type="primary" v-bind:class="{'btn-form-ensure': true}" @click="linkToEdit">编辑课程信息</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="course-form" v-show="showCatalogTwo">
            <el-form :model="addCatalogTwo" :rules="addCatalogTwoRules" ref="addCatalogTwo" label-width="200px" class="demo-ruleForm">
                <!-- 学段 -->
                <el-form-item label="文件类型" prop="fileType">
                    <el-radio-group v-model="addCatalogTwo.fileType">
                        <el-radio-button label="1">音频</el-radio-button>
                        <el-radio-button label="3">视频</el-radio-button>
                        <el-radio-button label="2">文档</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <!-- 上传方式 -->
                <el-form-item label="上传方式" prop="uploadType">
                    <el-radio-group v-model="addCatalogTwo.uploadType">
                        <el-radio-button label="1">本地上传</el-radio-button>
                        <!-- <el-radio-button label="2">课程url</el-radio-button> -->
                    </el-radio-group>
                </el-form-item>

                <!-- 文件上传一 -->
                <el-form-item label="文件上传一" prop="url" v-show="addCatalogTwo.uploadType == '1'">
                    <el-upload
                        class="upload-demo upload-file"
                        action="/privateapi/course/uploadFiles"
                        :data="{ 'customType': '2', 'courseCatalogId': addCatalogTwo.id, 'uploadType': 1, 'type': addCatalogTwo.fileType }"
                        :disabled="this.addCatalogTwo.urlOne.length > 0"
                        :before-upload="uploadCatalogTwoBefore"
                        :on-success="uploadCatalogTwoSucc"
                        :on-error="uploadError"
                        :on-remove="uploadCatalogTwoRemove"
                        :file-list="addCatalogTwo.urlOne">
                        <el-button size="" type="primary" :disabled="this.addCatalogTwo.urlOne.length > 0">选择文件</el-button>
                    </el-upload>
                    <p class="upload-tips">
                        查看支持的<el-button type="text" @click="openTooltip">文件格式</el-button>
                    </p>
                </el-form-item>

                <!-- 文件上传二 -->
                <el-form-item label="文件上传二" prop="url" v-show="addCatalogTwo.uploadType == '2'">
                    <el-input placeholder="请输入文件url链接" v-model="addCatalogTwo.urlTwo"></el-input>
                </el-form-item>

                <!-- 上传按钮 -->
                <el-form-item>
                    <el-button type="primary" v-bind:class="{'btn-form-cancle': true, 'btn-small': true}"  @click.native="showCatalogTwo = !showCatalogTwo">取消</el-button>
                    <el-button type="primary" v-bind:class="{'btn-form-ensure': true, 'btn-small': true}" @click="btnAddCatalogTwoSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { courseDetail } from '../api/api';

    export default {
        data() {
            var checkUrl = (rule, value, callback) => {
                if(this.addCatalogTwo.urlOne.length > 0 || this.addCatalogTwo.urlTwo) {
                    this.addCatalogTwo.url = 'true';
                    callback();
                } else {
                    this.addCatalogTwo.url = '';
                    callback(new Error('请选择文件或输入文件url链接'));
                }
            }
            return {
                courseID: this.$route.query.id,
                detail: [],
                showCatalogTwo: false,
                addCatalogTwo: {
                    id: '',
                    index: '',
                    subindex: '',
                    fileType: '',
                    uploadType: 1,
                    urlOne: [],
                    urlTwo: '',
                    url: '',
                    'fileName': '',
                    'attachmentId': '',
                    'uploadStatus': ''
                },
                addCatalogTwoRules: {
                    fileType: [
                        { required: true, message: '请选择文件类型' }
                    ],
                    uploadType: [
                        { required: true, message: '请选择上传方式' }
                    ],
                    url: [
                        { required: true, message: '请选择文件或输入文件url链接', validator: checkUrl }
                    ]
                }
            };
        },
        methods: {
            getCourseDetail() {
                let courseDetailParam = { courseId: this.courseID };

                courseDetail(courseDetailParam).then(res => {
                    let { code, msg, data} = res;
                    console.log(data)
                    if(code !== 0) {
                        this.getCourseDetail();
                    } else {
                        this.detail = data.courseAdminDetailVo;
                    }
                });
            },
            // 查看文件格式弹框
            openTooltip() {
                const h = this.$createElement;
                this.$msgbox({
                    title: '文件格式',
                    message: h('div', null, [
                        h('p', null, '1. 支持的源音视频文件格式：'),
                        h('p', null, '3gpp, asf/wmv, avi, flv/f4v, mkv, mov/mp4/m4a, mp3, mp2, mpeg/mpg, ts/ogg, mts, wmv/wma, rm/rmvb, webm等'),
                        h('p', null, '2.支持的视频编码标准：'),
                        h('p', null, 'H.264, H.263/H.263+, MPEG-1/2/4, VP8/9, Quicktime, RealVideo, WMV, MJPEG等'),
                        h('p', null, '3.支持的音频编码标准：'),
                        h('p', null, 'MP1, MP2, MP3, AAC, AC-3, WMA, PCM, ADPCM, AMR, RealAudio, Vorbis, DSD等'),
                        h('p', null, '4.支持的源文档格式：'),
                        h('p', null, 'doc、docx、ppt、pptx、xls、xlsx、vsd、pot、pps、rtf、wps、et、dps、pdf、txt、epub等')
                    ]),
                    confirmButtonText: '确定'
                });
            },
            // 二级目录 -- 文件上传方式一 -- 上传前检测文件类型是否勾选
            uploadCatalogTwoBefore() {
                if(this.addCatalogTwo.fileType == '') {
                    this.$message({ message: '请选择文件类型！', type: 'error'});
                    return false;
                }
            },
            // 二级目录 -- 文件上传方式一 -- 上传成功
            uploadCatalogTwoSucc(response, file, fileList) {
                this.addCatalogTwo.urlOne = fileList;
                this.addCatalogTwo.fileName = fileList[0].response.data.fileName;
                this.addCatalogTwo.attachmentId = fileList[0].response.data.attachmentId;
                this.addCatalogTwo.uploadStatus = 1;
            },
            // 二级目录 -- 文件上传方式一 -- 上传失败
            uploadError(response, file, fileList) {
                this.$message({ message: '文件上传失败，请重试！', type: 'error'});
            },
            // 二级目录 -- 文件上传方式一 -- 移除
            uploadCatalogTwoRemove(file, fileList) {
                this.addCatalogTwo.urlOne = fileList;
            },
            // 编辑内容
            btnEditCatalogTwo(index, subindex) {
                let catalogTwo = this.detail.courseCatalogVoList[index].list[subindex];

                this.addCatalogTwo.id = this.detail.courseCatalogVoList[index].list[subindex].id;
                this.addCatalogTwo.index = index;
                this.addCatalogTwo.subindex = subindex;
                this.addCatalogTwo.name = catalogTwo.title;
                this.addCatalogTwo.fileType = catalogTwo.fileType;
                this.addCatalogTwo.uploadType = 1;
                if(this.addCatalogTwo.uploadType == '1') {
                    this.addCatalogTwo.urlOne = [{
                        'name': catalogTwo.fileName
                    }];
                    this.addCatalogTwo.urlTwo = '';
                } else if(this.addCatalogTwo.uploadType == '2') {
                    this.addCatalogTwo.urlOne = [];
                    this.addCatalogTwo.urlTwo = catalogTwo.url;
                }
                this.addCatalogTwo.url = catalogTwo.url;
                this.addCatalogTwo.fileName = catalogTwo.fileName;
                this.addCatalogTwo.attachmentId = catalogTwo.attachmentId;
                this.addCatalogTwo.uploadStatus = catalogTwo.uploadStatus;

                this.showCatalogTwo = true;
            },
            // 上传内容
            btnAddCatalogTwo(index, subindex) {
                this.addCatalogTwo.id = this.detail.courseCatalogVoList[index].list[subindex].id;
                this.addCatalogTwo.index = index;
                this.addCatalogTwo.subindex = subindex;
                this.addCatalogTwo.name = '';
                this.addCatalogTwo.fileType = '';
                this.addCatalogTwo.uploadType = 1;
                this.addCatalogTwo.urlOne = [];
                this.addCatalogTwo.urlTwo = '';
                this.addCatalogTwo.url = '';
                this.addCatalogTwo.fileName = '';
                this.addCatalogTwo.attachmentId = '';
                this.addCatalogTwo.uploadStatus = '';

                this.showCatalogTwo = true;
            },
            btnAddCatalogTwoSubmit() {
                this.$refs['addCatalogTwo'].validate((valid) => {
                    if (valid) {
                        let catalogArr = this.detail.courseCatalogVoList[this.addCatalogTwo.index].list[this.addCatalogTwo.subindex];

                        catalogArr.fileType = this.addCatalogTwo.fileType;
                        catalogArr.fileName = this.addCatalogTwo.fileName;
                        catalogArr.uploadStatus = this.addCatalogTwo.uploadStatus;

                        this.showCatalogTwo = false;
                    } else {
                        return false;
                    }
                });
            },
            linkToList() {
                this.$router.push({ path: '/course' });
            },
            linkToEdit() {
                this.$router.push({ path: '/course/create', query: { id: this.courseID } });
            }
        },
        mounted() {
            this.$store.state.leftnav = 'course';
            this.getCourseDetail();
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

                    .text{
                        font-size: 12px;
                        color: #333;
                        line-height: 18px;
                        padding: 11px 0;

                        &.state-orange{
                            color: #F8BE3E;
                        }
                    }

                    .pic{
                        display: inline-block;
                        height: 42px;
                        margin-right: 10px;
                    }
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
        
        .upload-file{
            font-size: 0;
            .el-upload{
                font-size: 0;
                
                .el-button{
                    padding: 0 24px;
                    height: 40px;
                }
            }

            .el-upload-list{
                display: block;

                .el-upload-list__item{
                    position: relative;
                    width: 420px;
                    height: 70px;
                    background: #FFFFFF;
                    border: 1px solid #E5E5E5;
                    border-radius: 2px;

                    .el-upload-list__item-name{
                        display: inline-block;
                        padding-left: 60px;
                        line-height: 68px;
                        font-size: 12px;
                        color: #999;
                        margin: 0;

                        .el-icon-document{
                            position: absolute;
                            z-index: 3;
                            top: 0;
                            left: 0;
                            width: 60px;
                            font-size: 40px;
                            line-height: 68px;
                            text-align: center;
                        }
                    }
                    
                    .el-upload-list__item-status-label{
                        display: none;
                        top: 22px;
                        right: 25px;
                    }
                    .el-icon-close{
                        position: absolute;
                        z-index: 3;
                        right: 25px;
                        top: 50%;
                        display: none;
                        -webkit-transform: translate3d(0, -50%, 0);
                                transform: translate3d(0, -50%, 0);
                    }

                    .el-progress{
                        position: absolute;
                        width: 60%;
                        bottom: 10px;
                        left: 60px;

                        .el-progress__text{
                            top: 2px;
                            right: -40px;
                        }
                    }

                    &.is-success{
                        .el-upload-list__item-status-label{
                            display: block;
                        }

                        .el-icon-close{
                            display: none;
                        }

                        &:hover{
                            .el-upload-list__item-status-label{
                                display: none;
                            }
                            
                            .el-icon-close{
                                display: block;
                            }
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
            width: 790px;
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


                            &.state-orange{
                                color: #F8BE3E;
                            }
                            &.state-green{
                                color: #13ce66;
                            }
                            &.state-red{
                                color: #ff4949;
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


