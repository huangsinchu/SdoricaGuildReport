const _ = require('lodash');
const db = require('monk')('localhost/sdoricaguildreport')

let fomartDateTime = (dateTime) => {
    let date = new Date(dateTime);
    date.setHours(date.getHours() - 5);
    return String(date.getMonth() + 1) + '/' + date.getDate()
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
        if (recordTimeList.length >= 10) return;
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