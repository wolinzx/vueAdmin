<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.content" placeholder="书名 / 作者 / ISBN"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe :data="books" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			<el-table-column type="selection" width="55">
			</el-table-column>
      <el-table-column prop="bookid" label="ID" width="auto" sortable>
			</el-table-column>
      <el-table-column prop="image" label="封面" width="70" >
        <template slot-scope="scope">
          <img class="books-image" :src="scope.row.image" alt="">
        </template>
			</el-table-column>
			<el-table-column prop="bookname" label="书名" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="author" label="作者" width="150" >
			</el-table-column>
			<el-table-column prop="author_intro" label="作者简介" width="220" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="isbn13" label="ISBN" width="160" >
			</el-table-column>
      <el-table-column prop="price" label="价格" width="120" sortable>
			</el-table-column>
      <el-table-column prop="publisher" label="出版社" width="280" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="pubdate" label="出版日期" width="120" >
			</el-table-column>
      <el-table-column prop="summary" label="简介" width="220" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="catalog" label="日志" width="220" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="tags" label="标签" width="120" >
			</el-table-column>
      <el-table-column prop="pages" label="页数" width="120" >
			</el-table-column>
      <el-table-column prop="average" label="评分" width="120" sortable>
			</el-table-column>
      <el-table-column prop="stock" label="库存" width="120" >
			</el-table-column>
      <el-table-column prop="classify" label="分类" width="120" >
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right">
				<template slot-scope="scope">
					<el-button  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="ISBN">
          <el-input v-model="form.isbn" placeholder="ISBN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchIsbn">查询</el-button>
        </el-form-item>
      </el-form>
			<el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>书籍信息</span>
        </div>
        <!-- <div v-for="(byIsbnBook,key,index) in byIsbnBooks" :key="index" class="text item">
          {{ byIsbnBook.title + ':'+ byIsbnBook.value }}
        </div> -->
        <div v-if="isbnSearchSuc" class="isbn-box">
          <div>
             <img class="isbn-img" :src="byIsbnBooks.dbImg.value" alt="">
          </div>
          <div>
            <span>书名：</span>
            <p>{{byIsbnBooks.dbTitle.value}}</p>
          </div>
          <div>
            <span>作者：</span>
            <p>{{byIsbnBooks.dbAuthor.value}}</p>
          </div>
          <div>
            <span>评分：</span>
            <el-rate
              v-model="rate"
              disabled
              show-text
              text-color="#ff9900"
              :max="max"
              allow-half
              score-template="{value}">
            </el-rate>
          </div>
          
        </div>
      </el-card>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import axios from 'axios';
  var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });
	import { getUserListPage, getSearchIsbn, getPageCount, searchBooksListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
        nihao: '你好',
        total: 0,
        page: 1,
        max: 10,
				filters: {
					content: ''
				},
				books: [],
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
        },
        form: {
          isbn: '',
        },
        byIsbnBooks: {},
        isbnSearchSuc: false,
        rate: 0
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					// page: this.page,
					bookname: this.filters.content
        };
        let para2 = {
          index: this.page,
          size: 10
        };
				this.listLoading = true;
        if(this.filters.content == ''){
            getPageCount().then((res) => {
              console.log(111,res.data);
              this.total = Number(res.data.count);
              console.log(222,this.total);
            });
            getUserListPage(para2).then((res) => {  
              this.books = res.data;
              this.listLoading = false;
          });
        } 
        else 
        {
          searchBooksListPage(para).then((res) => {
            this.total = 1;
            this.books = res.data;
            this.listLoading = false;
          });
        }
      },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = {
                isbn: this.form.isbn
              }
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								// this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
      selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.multipleSelection.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
      searchIsbn() {
        console.log(this.form.isbn);
        let isbn = this.form.isbn;
        getSearchIsbn(isbn)
        .then((res) => {
          this.byIsbnBooks = {
            dbImg: { title: '封面', value: res.data.image},
            dbTitle: { title: '书名', value: res.data.title,},
            dbAverage: { title: '评分', value: res.data.rating.average,},
            dbAuthor: { title: '作者', value: res.data.author[0]},
          }
          this.isbnSearchSuc = true;
          this.rate =  Number(res.data.rating.average);
        })
        .catch((err)=>{
          this.isbnSearchSuc = false;
          this.$message({
            message: '未找到改书籍',
            type: 'error'
          });
        })
      }
		},
		mounted() {
			this.getUsers();
    }
	}

</script>

<style scoped>
.books-image{
  width: 100%;
  vertical-align: middle;
}
.isbn-box{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.isbn-box div span{
  font-weight: bold;
}
.isbn-box div p,
.isbn-box div div{
  display: inline-block;
}
.isbn-box div:first-child div{
  margin-top: 10px;
}
.isbn-img{
  width: 100px;
}
.isbn-img img{
  width: 100%;
}
</style>