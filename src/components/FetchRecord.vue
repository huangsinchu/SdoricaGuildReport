<template>
  <div>
    <img style="padding: 5px;" src="../assets/sdorica.png">
    <el-form ref="form" :model="form" label-width="135px">
      <el-form-item label="AccessToken">
        <el-input v-model="form.accessToken"></el-input>
      </el-form-item>
      <el-form-item label="BaseUrl">
        <el-input v-model="form.baseUrl"></el-input>
      </el-form-item>
      <el-form-item label="GameDataVersion">
        <el-input-number v-model="form.dataVersion" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-input
        type="textarea"
        :autosize="{minRows: 5}"
        resize='none'
        placeholder="返回结果"
        v-model="result">
      </el-input>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      form: {
        accessToken: '',
        baseUrl: '',
        dataVersion: ''
      },
      result: ''
    }
  },
  created () {
    this.$http.get('/api/get-game-request-info').then(res => {
      this.form.baseUrl = res.data.baseUrl
      this.form.dataVersion = res.data.dataVersion
    })
  },
  methods: {
    onSubmit () {
      if (this.form.accessToken && this.form.dataVersion) {
        this.$http({
          method: 'post',
          url: '/api/record-guild-members-info',
          data: this.form
        }).then((res) => {
          this.result = this.formatResult(res.data)
        })
      }
    },
    formatResult (result) {
      return _.map(result, JSON.stringify).join('\n\n')
    }
  }
}
</script>
