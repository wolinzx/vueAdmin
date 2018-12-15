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
			<el-table-column prop="author" label="作者" width="150" show-overflow-tooltip>
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
				<el-form-item label="书名" prop="bookname">
					<el-input v-model="editForm.bookname" auto-complete="off" disabled></el-input>
				</el-form-item>
        <el-form-item label="评分" prop="average">
          <el-input v-model="editForm.average" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="价格" prop="price">
					<el-input v-model="editForm.price" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="库存" prop="stock">
					<el-input v-model="editForm.stock" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="分类" prop="bookname">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="editForm.classify"
            @change="selectedOptionsChange">
          </el-cascader>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="form" class="demo-form-inline add-form" :rules="addFormRules" ref="addForm">
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" placeholder="ISBN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchIsbn">查询</el-button>
        </el-form-item>
        <span class="block">
          <el-form-item>
            <span class="demonstration">分类</span>
          </el-form-item>
          <el-form-item>
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="selectedOptionsChange"
              :disabled="!allowSubmit1">
            </el-cascader>
          </el-form-item>
        </span>
        <el-form-item>
          <el-button type="primary" @click.native="addSubmit" :loading="editLoading" :disabled="!allowSubmit2">添加</el-button>
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
			<!-- <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div> -->
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util.js'
	import { getUserListPage, addBooksList, getSearchIsbn, getPageCount, searchBooksListPage, removeBook, batchRemoveUser, editBook } from '@/api/api';
  import { throws } from 'assert';
  import { log } from 'util';

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
					average: [
						{ required: true, message: '请输入评分', trigger: 'blur' }
          ],
          price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
          ],
          stock: [
						{ required: true, message: '请输入库存', trigger: 'blur' }
          ]
				},
				//编辑界面数据
				editForm: {
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					isbn: [
						{ required: true, message: '请输入ISBN', trigger: 'blur' }
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
        rate: 0,
        options: [{
          value: '7',
          label: '少儿教育',
          children: [{
            value: '7',
            label: '少儿教育'
          }]
        }, {
          value: '1',
          label: '文学著作',
          children: [{
            value: '11',
            label: '经典文学'
          }, {
            value: '12',
            label: '古典文学'
          }, {
            value: '13',
            label: '当代文学'
          }, {
            value: '14',
            label: '儿童文学'
          }]
        }, {
          value: '2',
          label: '人文历史',
          children: [{
            value: '21',
            label: '传记纪实'
          }, {
            value: '22',
            label: '艺术生活'
          }, {
            value: '23',
            label: '影视理论'
          }, {
            value: '24',
            label: '宗教学'
          }]
        }, {
          value: '3',
          label: '流行小说',
          children: [{
            value: '31',
            label: '悬疑推理'
          }, {
            value: '32',
            label: '科幻奇幻'
          }, {
            value: '33',
            label: '青春治愈'
          }, {
            value: '34',
            label: '绘本漫画'
          }]
        }, {
          value: '4',
          label: '经管商业',
          children: [{
            value: '41',
            label: '商业传记'
          }, {
            value: '42',
            label: '企业管理'
          }, {
            value: '43',
            label: '金融投资'
          }, {
            value: '44',
            label: '经济学'
          }]
        }, {
          value: '5',
          label: '科技创新',
          children: [{
            value: '51',
            label: '科普读物'
          }, {
            value: '52',
            label: '互联网+'
          }, {
            value: '53',
            label: '人工智能'
          }, {
            value: '54',
            label: '区块链'
          }]
        }, {
          value: '6',
          label: '生活必备',
          children: [{
            value: '61',
            label: '亲密关系'
          }, {
            value: '62',
            label: '人际关系'
          }, {
            value: '63',
            label: '职场提升'
          }, {
            value: '64',
            label: '教育学'
          }]
        }, ],
        selectedOptions: [],
        selectedOptions2: [],
        allowSubmit1: false,
        allowSubmit2: false,
        sendSels: []
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
          let a = [{bookid: row.bookid}];
          let para = { bookid: JSON.stringify(a) };
					removeBook(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch((err) => {
          throw err
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.editForm.classify = [row.classify.substr(0,1), row.classify];
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
			//增加
			addSubmit: function () {
				// this.$refs.editForm.validate((valid) => {
				// 	if (valid) {
						this.$confirm('确认添加吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = {
                isbn: this.form.isbn,
                classifyid: this.selectedOptions[1]
              }
              console.log(para);
							addBooksList(para).then((res) => {
                this.editLoading = false;
                console.log(res.data);
                if(res.data){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.editFormVisible = false;
                  this.getUsers();
                }else{
                  this.$message({
                    message: '列表中已存在当前书籍',
                    type: 'error'
                  });
                }
							});
						});
					// }
				// });
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
              //NProgress.start();
              let _formText = this.editForm
							let para = {
                bookid: _formText.bookid,
                average: _formText.average,
                price: _formText.price,
                stock: _formText.stock,
                classify: _formText.classify[1],
              };
              console.log(para);
              
							editBook(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
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
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
          let a = [];
          let sels = this.sels;
          if(sels){
            for(let s in sels){
              let o = {};
              o['bookid'] = sels[s].bookid;
              a.push(o);
            }
            this.sendSels = JSON.stringify(a);
            // this.sendSels = eval("("+jsonString+")");
            // console.log(this.sendSels);
          }
					this.listLoading = true;
					//NProgress.start();
          let para = { bookid: this.sendSels };
					removeBook(para).then((res) => {
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
          this.allowSubmit1 = true;
          this.rate =  Number(res.data.rating.average);
        })
        .catch((err)=>{
          this.isbnSearchSuc = false;
          this.allowSubmit1 = false;
          this.allowSubmit2 = false;
          this.$message({
            message: '未找到该书籍',
            type: 'error'
          });
        })
      },
      selectedOptionsChange(val) {
        if(val){
          this.allowSubmit2 = true;
          console.log(val);
        }
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
.isbn-box>div>p{
  margin: 0;
}
.isbn-box>div{
  margin-top: 10px;
}
.add-form{
  display: flex;
  justify-content: space-between;
}
</style>