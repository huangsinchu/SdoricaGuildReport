const _ = require('lodash');
const db = require('monk')('localhost/sdoricaguildreport');
const baseUrlCollection = db.get('baseUrl');
const dataVersionCollection = db.get('dataVersion');
const fetchRecordCollection = db.get('fetchRecord');
const memberRecordCollection = db.get('memberRecord');

const sdorica = require('./sdorica.js');

const fetchGuildMembersInfo = async (ctx, next) => {
    let accessToken = ctx.request.body.accessToken,
        baseUrl = ctx.request.body.baseUrl,
        dataVersion = ctx.request.body.dataVersion;
    let sdoricaGetter = sdorica.init(baseUrl, accessToken, dataVersion);
    await baseUrlCollection.remove({});
    await baseUrlCollection.insert({url: baseUrl});
    await dataVersionCollection.remove({});
    await dataVersionCollection.insert({version: dataVersion});
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
    await fetchRecordCollection.insert({
        recordTime: dateTime,
        guildId: guildInfo.guildId,
        guildName: guildInfo.name,
        coin: guildInfo.coin,
        ring: guildInfo.ring
    });
    let res = await memberRecordCollection.insert(memberRecords);
    ctx.response.body = res;
    await next();
}

const getGameRequestInfo = async (ctx, next) => {
    let baseUrl = await baseUrlCollection.findOne({});
    let dataVersion = await dataVersionCollection.findOne({});
    ctx.response.body = {
        baseUrl: baseUrl && baseUrl.urll || '',
        dataVersion: dataVersion && dataVersion.version || ''
    }
    await next();
}

module.exports = (router) => {
    router.post('/record-guild-members-info', fetchGuildMembersInfo);
    router.get('/get-game-request-info', getGameRequestInfo);
}