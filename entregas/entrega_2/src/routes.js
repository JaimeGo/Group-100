const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');

const questions=require('./routes/questions');
const answers=require('./routes/answers');
const comments=require('./routes/comments');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());

router.use('/questions', questions.routes());
router.use('/answers', answers.routes());
router.use('/comments', comments.routes());

module.exports = router;
