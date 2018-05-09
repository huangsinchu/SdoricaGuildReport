const Axios = require('axios');

const initAxiosInstance = (accessToken) => {
    var axiosInstance = Axios.create({
        baseURL: 'https://exp.sdorica.dragonest.com/',
        timeout: 1000,
        headers: {
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': accessToken,
            'Game-Data-Revision': 99,
            'Connection': 'Keep-Alive, TE',
            'TE': 'identity',
            'User-Agent': 'BestHTTP'
        }
    });
    return {
        getUserGuildInfo: async () => {
            let guildInfoData = await axiosInstance.post('guild/status', {locale: 'zh_CN'});
            let guildInfo =  guildInfoData.data.data.guildDetail;
            this.guildId = guildInfo.guildId;
            return guildInfo;
        },
        getGuildMembersInfo: async () => {
            if (!this.guildId) {
                await this.getUserGuildInfo();
            }
            let guildMembersInfo = await axiosInstance.post('guild/members', {
                guildId: this.guildId
            });
            return guildMembersInfo.data.data;
        }
    }
}

exports.init = initAxiosInstance;