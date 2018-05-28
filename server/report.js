const _ = require('lodash');
const db = require('monk')('localhost/sdoricaguildreport')

let fomartDateTime = (dateTime) => {
    let date = new Date(dateTime);
    date.setHours(date.getHours() - 5);
    return String(date.getMonth() + 1) + '/' + date.getDate()
}

const getPrestigeLevelFromValue = (prestige) => {
    if (prestige < 200) {
        return 1;
    } else if (prestige < 500) {
        return 2;
    } else if (prestige < 1000) {
        return 3;
    } else if (prestige < 2000) {
        return 4;
    } else if (prestige < 4000) {
        return 5;
    } else if (prestige < 7000) {
        return 6;
    } else if (prestige < 15000) {
        return 7;
    } else if (prestige < 30000) {
        return 8;
    } else if (prestige < 60000) {
        return 9;
    } else if (prestige < 150000) {
        return 10;
    } else if (prestige < 350000) {
        return 11;
    } else {
        return 12;
    }
}

let getGuildDonateReport = async (ctx, next) => {
    let guildId = ctx.query.guildId;
    let fetchRecords = await db.get('fetchRecord').find({
            guildId: guildId
        }, {
            sort: {
                recordTime: -1
            }
        });
    if (fetchRecords.length === 0) {
        await next();
        return;
    }

    let recordTimeList = [];
    _.each(fetchRecords, (fetchRecord) => {
        if (recordTimeList.length >= 30) return;
        let timeDisplay = fomartDateTime(fetchRecord.recordTime);
        if (recordTimeList.length === 0 || recordTimeList[recordTimeList.length - 1].display !== timeDisplay) {
            recordTimeList.push({
                value: fetchRecord.recordTime,
                display: timeDisplay
            })
        }
    });

    let recordTimes = _.map(recordTimeList, (recordTime) => {
        return recordTime.value;
    });
    let memberRecords = await db.get('memberRecord').find({
        guildId: guildId,
        recordTime: {'$in': recordTimes}
    });

    let recentRecordTime = recordTimeList[0].value;
    let overviewPerMember = _.chain(memberRecords)
        .filter({recordTime: recentRecordTime})
        .map((memberRecord) => {
            return {
                sid: memberRecord.sid,
                name: memberRecord.name,
                donateCoin: [memberRecord.donateCoin],
                donateRing: [memberRecord.donateRing],
                prestigeLv: getPrestigeLevelFromValue(memberRecord.prestige),
                end: false
            }
        })
        .value();
    _.each(recordTimeList.slice(1), (recordTime) => {
        _.each(overviewPerMember, (memberOverview) => {
            if (memberOverview.end) return;
            let rec = _.find(memberRecords, {
                sid: memberOverview.sid,
                recordTime: recordTime.value
            });
            if (!rec) {
                memberOverview.end = true;
                return;
            }
            memberOverview.donateCoin.push(rec.donateCoin);
            memberOverview.donateRing.push(rec.donateRing);
        });
    });

    _.each(recordTimeList, (kvp) => {
        kvp.value = String(kvp.value)
    })
    let responseBody = {
        guildName: fetchRecords[0].guildName,
        recordTimeList: recordTimeList,
        memberRecords: overviewPerMember
    }

    ctx.response.body = responseBody;
    await next();
}

module.exports = (router) => {
    router.get('/guild-donate-report', getGuildDonateReport);
}