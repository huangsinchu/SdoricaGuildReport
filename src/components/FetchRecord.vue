<template>
  <div>
      <el-input placeholder="请输入AccessToken" v-model="accessToken">
        <el-button slot="append" icon="el-icon-check" @click='onSubmit'></el-button>
      </el-input>
      <div>
        {{ result }}
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accessToken: '',
      result: ''
    }
  },
  methods: {
    onSubmit () {
      if (this.accessToken) {
        this.$http({
          method: 'post',
          url: '/api/record-guild-members-info',
          data: {
            accessToken: this.accessToken
          }
        }).then((res) => {
          this.result = res.data
        })
      }
    }
  }
}
</script>
