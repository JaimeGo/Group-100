const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const ongs = require('./routes/ongs');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/ongs', ongs.routes());

module.exports = router;
