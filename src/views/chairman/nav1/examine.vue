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
			</el-form>
		</el-col>

		<!--列表-->
		<el-table ref="filterTable" stripe :data="books" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			<el-table-column type="selection" width="55">
			</el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="120"
        :filters="[{ text: '审核通过', value: '审核通过' }, { text: '审核未通过', value: '审核未通过' }, { text: '待审核', value: '待审核' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
        fixed="left">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '审核通过' ? 'success' : ( scope.row.state === '审核未通过' ? 'danger' : 'warning')"
            disable-transitions>{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="distributorid" label="ID" width="auto" sortable> 
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
					<el-button type="success" @click="handleExamine(scope.$index, scope.row, 'pass')">通过</el-button>
					<el-button type="danger" @click="handleExamine(scope.$index, scope.row, 'unpass')">未通过</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="success" @click="batch('pass')" :disabled="this.sels.length===0">批量通过</el-button>
			<el-button type="danger" @click="batch('unpass')" :disabled="this.sels.length===0">批量未通过</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '@/common/js/util'
	import { distributorGetqurey, distributorGetcount, searchDistributorbook, distributorGetdelete, examineGetqurey, examineGetcount, examineGetonequrey, examineGetupdate } from '@/api/api';
  import { throws } from 'assert';
  import { log } from 'util';

	export default {
		data() {
			return {
        total: 0,
        page: 1,
        max: 10,
				filters: {
					content: ''
				},
				books: [],
				listLoading: false,
				sels: [],//列表选中列
        sendSels: [],
        distributorAccount: ''
			}
		},
		methods: {
      filterTag(value, row) {
        return row.state === value;
      },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					// page: this.page,
          bookname: this.filters.content,
        };
        let para2 = {
          index: this.page,
          size: 10,
        };
				this.listLoading = true;
        if(this.filters.content == ''){
            examineGetcount().then((res) => {
              this.total = Number(res.data.count);
            });
            examineGetqurey(para2).then((res) => {  
              console.log(res.data);
              this.books = res.data;
              this.listLoading = false;
          });
        } 
        else 
        {
          examineGetonequrey(para).then((res) => {
            this.total = 1;
            this.books = res.data;
            this.listLoading = false;
          });
        }
      },
      selsChange: function (sels) {
        this.sels = sels;
			},
			//批量
			batch: function (val) {
        let state = val == 'pass' ? '审核通过' : '审核未通过';
				this.$confirm('确认' + state +'选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
          let a = [];
          let sels = this.sels;
          if(sels){
            for(let s in sels){
              let o = {};
              o['distributorid'] = sels[s].distributorid;
              o['state'] = state;
              a.push(o);
            }
            this.sendSels = JSON.stringify(a);
            // this.sendSels = eval("("+jsonString+")");
            // console.log(this.sendSels);
          }
					this.listLoading = true;
					//NProgress.start();
          let para = { distributorid: this.sendSels };
          console.log(para);
          
					examineGetupdate(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '审核成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch((err) => {
          throw err
				});
			},
      selectedOptionsChange(val) {
        if(val){
          this.allowSubmit2 = true;
          console.log(val);
        }
      },
      //单条审核
			handleExamine: function (index, row, val) {
        let state = val == 'pass' ? '审核通过' : '审核未通过';
        this.listLoading = true;
        //NProgress.start();
        let a = [{distributorid: row.distributorid, state}];
        let para = { distributorid: JSON.stringify(a) };
        examineGetupdate(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '审核成功',
            type: 'success'
          });
          this.getUsers();
        });
			},
		},
		mounted() {
      this.distributorAccount  = JSON.parse(sessionStorage.getItem('user')).account;
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
</style>