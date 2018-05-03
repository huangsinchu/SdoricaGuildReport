const Axios = require('axios');
const _ = require('lodash');
const dbConnector = require('./dbconnector.js');

const fetchGuildMembersInfo = async (ctx, next) => {
    let accessToken = ctx.request.body.accessToken;
    let axiosInstance = Axios.create({
        baseURL: 'https://exp.sdorica.dragonest.com/',
        timeout: 1000,
        headers: {
            'Accept-Encoding': 'gzip',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Token': accessToken,
            'Game-Data-Revision': 96,
            'Connection': 'Keep-Alive, TE',
            'TE': 'identity',
            'User-Agent': 'BestHTTP'
        }
    });
    let guildInfo = await axiosInstance.post('guild/status', {
        locale: 'zh_CN'
    });
    let guildId = guildInfo.data.data.guildId;
    let guildMembersInfo = await axiosInstance.post('guild/members', {
        guildId: guildId
    });
    let recordDate = new Date();
    recordDate.setHours(recordDate.getHours() -5);
    let dateTime = recordDate.getTime();
    let memberRecords = _.map(guildMembersInfo.data.data, (user) => {
        return {
            sid: user.oid,
            guildId: user.guild.guildId,
            name: user.name,
            donateCoin: user.guild.donateCoin,
            donateRing: user.guild.donateRing,
            prestige: user.prestige,
            recordTime: dateTime
        }
    });
    dbConnector.insert('fetchRecord', {
        recordTime: dateTime,
        guildId: guildId,
        coin: guildInfo.data.data.coin,
        ring: guildInfo.data.data.ring
    }, (result) => {});
    dbConnector.insert('memberRecord', memberRecords, (result) => {});
    ctx.response.body = memberRecords;
    await next();
}

module.exports = (router) => {
    router.post('/record-guild-members-info', fetchGuildMembersInfo);
}