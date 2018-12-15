<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
		</el-col>

		<!--列表-->
		<el-table ref="filterTable" stripe :data="books" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" >
			<el-table-column type="selection" width="55">
			</el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="120"
        :filters="[{ text: '已处理', value: '已处理' }, { text: '未处理', value: '未处理' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
        fixed="left">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '已处理' ? 'success' : 'danger'"
            disable-transitions>{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="messageid" label="ID" width="100" sortable> 
			</el-table-column>
			<el-table-column prop="title" label="标题" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="message" label="留言内容" width="340" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="account" label="留言者" width="100" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="phone" label="手机" width="150" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="msgdate" label="留言时间" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right">
				<template slot-scope="scope">
					<el-button  @click="handleExamine(scope.$index, scope.row, '已处理')">已处理</el-button>
					<el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="primary" @click="batchDeal('已处理')" :disabled="this.sels.length===0">批量处理</el-button>
			<el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '@/common/js/util'
	import { examineGetmsg, examineGetdeal, examineDelete } from '@/api/api';
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
        examineGetmsg().then((res) => {
          this.total = 1;
          this.books = res.data;
          console.log(this.books);
          
          this.listLoading = false;
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
			},
			//批量处理
			batchDeal: function (state) {
				this.$confirm('确认处理选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
          let a = [];
          let sels = this.sels;
          if(sels){
            for(let s in sels){
              let o = {};
              o['messageid'] = sels[s].messageid;
              o['state'] = state;
              a.push(o);
            }
            this.sendSels = JSON.stringify(a);
            // this.sendSels = eval("("+jsonString+")");
            // console.log(this.sendSels);
          }
					this.listLoading = true;
					//NProgress.start();
          let para = { messageid: this.sendSels };
					examineGetdeal(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '处理成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch((err) => {
          throw err
				});
      },
      //删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
          //NProgress.start();
          let a = [{messageid: row.messageid}];
          let para = { messageid: JSON.stringify(a) };
					examineDelete(para).then((res) => {
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
      //批量删除
			batchDelete: function (val) {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
          let a = [];
          let sels = this.sels;
          if(sels){
            for(let s in sels){
              let o = {};
              o['messageid'] = sels[s].messageid;
              a.push(o);
            }
            this.sendSels = JSON.stringify(a);
            // this.sendSels = eval("("+jsonString+")");
            // console.log(this.sendSels);
          }
					this.listLoading = true;
					//NProgress.start();
          let para = { messageid: this.sendSels };
					examineDelete(para).then((res) => {
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
      selectedOptionsChange(val) {
        if(val){
          this.allowSubmit2 = true;
          console.log(val);
        }
      },
      //单条审核
			handleExamine: function (index, row, state) {
        this.listLoading = true;
        //NProgress.start();
        let a = [{messageid: row.messageid, state}];
        let para = { messageid: JSON.stringify(a) };
        examineGetdeal(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '处理成功',
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