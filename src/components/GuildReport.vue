<template>
  <div style="height: 100%">
    <div style="padding: 5px; height: 120px; display: flex">
      <img src="../assets/sdorica.png">
      <el-form style="padding: 10px 40px" label-position="top" label-width="80px" @submit.native.prevent>
        <el-form-item label="最近多次统计">
          <el-input-number v-model="count" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div style="height: calc(100vh - 130px)">
      <el-table v-loading.fullscreen.lock='loading' :data='tableData' style='width: 100%' height="100%" size='small'>
        <el-table-column fixed label='名字' width='150'>
          <template slot-scope="scope">{{ scope.row.name + '(Lv' + scope.row.prestigeLv + ')' }}</template>
        </el-table-column>
        <el-table-column :label='"<" + guildName + "> 魂晶碎片捐赠记录"'>
          <el-table-column v-for='colHeader in colHeaders' :key='colHeader.value' :prop='colHeader.value' :label='colHeader.display' sortable width='100'>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      loading: true,
      guildName: '工会',
      memberRecords: [],
      recordTimeList: [],
      count: 0
    }
  },
  computed: {
    summaryHeader () {
      return {
        value: 'last' + this.count,
        display: '最近' + this.count + '次总计'
      }
    },
    colHeaders () {
      return (this.count > 0 ? [this.summaryHeader] : []).concat(this.recordTimeList)
    },
    tableData () {
      return _.map(this.memberRecords, (memberRecord) => {
        let row = {
          name: memberRecord.name,
          prestigeLv: memberRecord.prestigeLv
        }
        if (memberRecord.donateRing.length > this.count) {
          row[this.summaryHeader.value] = memberRecord.donateRing[0] - memberRecord.donateRing[this.count]
        }
        for (let i = 0; i < memberRecord.donateRing.length; i++) {
          let diffString = ''
          if (i < memberRecord.donateRing.length - 1) {
            let diff = memberRecord.donateRing[i] - memberRecord.donateRing[i + 1]
            diffString = String(diff)
            if (diff >= 0) {
              diffString = '+' + diffString
            }
            diffString = '(' + diffString + ')'
          }
          row[this.recordTimeList[i].value] = memberRecord.donateRing[i] + diffString
        }
        return row
      }, this)
    }
  },
  created () {
    let guild = this.$route.query.guildId || '59c369192e0eb50001d939a6'
    this.$http.get('/api/guild-donate-report?guildId=' + guild).then(res => {
      this.loading = false
      this.guildName = res.data.guildName
      this.recordTimeList = res.data.recordTimeList
      this.memberRecords = res.data.memberRecords
    })
  }
}
</script>
