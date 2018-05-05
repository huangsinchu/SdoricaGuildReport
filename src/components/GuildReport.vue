<template>
  <el-table v-loading.fullscreen.lock='loading' :data='tableData' style='width: 100%' :height="height">
    <el-table-column fixed prop='name' label='名字' width='150'>
    </el-table-column>
    <el-table-column :label='"<" + guildName + "> 魂晶碎片捐赠记录"'>
      <el-table-column v-for='date in recordDate' :key='date.value' :prop='date.value' :label='date.display' width='120'>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      loading: true,
      height: 800,
      guildName: '工会',
      recordDate: [],
      tableData: []
    }
  },
  created () {
    let guild = this.$route.query.guildId || '59c369192e0eb50001d939a6'
    this.$http.get('/api/guild-donate-report?guildId=' + guild).then(res => {
      this.loading = false
      this.guildName = res.data.guildName
      this.recordDate = res.data.recordTimeList
      this.tableData = _.map(res.data.memberRecords, (memberRecord) => {
        let row = {
          name: memberRecord.name
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
          row[res.data.recordTimeList[i].value] = memberRecord.donateRing[i] + diffString
        }
        return row
      })
    })
  }
}
</script>
