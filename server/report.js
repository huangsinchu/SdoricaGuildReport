const _ = require('lodash');
const dbConnector = require('./dbconnector.js');

let getGuildDonateReport = async (ctx, next) => {
    let guildId = ctx.query.guildId;
    
    await next();
}

module.exports = (router) => {
    router.get('/guild-donate-report', getGuildDonateReport);
}