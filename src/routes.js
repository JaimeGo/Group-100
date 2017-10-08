const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const ongs = require('./routes/ongs');
const users = require('./routes/users');
const session = require('./routes/session')

const questions = require('./routes/questions')

const router = new KoaRouter();

router.use(async (ctx, next) => {
	Object.assign(ctx.state, {
		currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
		newSessionPath: ctx.router.url('newSession'),
		destroySessionPath: ctx.router.url('destroySession'),
		usersPath: ctx.router.url('users'),
		allQuestionsPath: ctx.router.url('allQuestions'),
		newQuestionPath: ctx.router.url('newQuestion')
	});
	return next();
})

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/ongs', ongs.routes());
router.use('/users', users.routes());
router.use('/session', session.routes());

router.use('/questions', questions.routes());


module.exports = router;