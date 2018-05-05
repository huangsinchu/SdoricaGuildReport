const _ = require('lodash');
const db = require('monk')('localhost/sdoricaguildreport')

const sdorica = require('./sdorica.js');

const fetchGuildMembersInfo = async (ctx, next) => {
    let sdoricaGetter = sdorica.init(ctx.request.body.accessToken)
    let guildInfo = await sdoricaGetter.getUserGuildInfo();
    let guildMembersInfo = await sdoricaGetter.getGuildMembersInfo();
    let dateTime = (new Date()).getTime();
    let memberRecords = _.map(guildMembersInfo, (user) => {
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
    await db.get('fetchRecord').insert({
        recordTime: dateTime,
        guildId: guildInfo.guildId,
        guildName: guildInfo.name,
        coin: guildInfo.coin,
        ring: guildInfo.ring
    });
    let res = await db.get('memberRecord').insert(memberRecords);
    ctx.response.body = res;
    await next();
}

module.exports = (router) => {
    router.post('/record-guild-members-info', fetchGuildMembersInfo);
}