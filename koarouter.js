const recordController = require('./server/record.js');
const reportController = require('./server/report.js');

const koaRouter = require('koa-router');
let router = koaRouter();

recordController(router);
reportController(router);

let exportRouter = koaRouter();
exportRouter.use('/api', router.routes());
module.exports = exportRouter;