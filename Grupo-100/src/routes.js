const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');

const users = require('./routes/users');
const session = require('./routes/session')

const questions = require('./routes/questions')

const answers = require('./routes/answers')
const comments = require('./routes/comments')

const tags = require('./routes/tags')
// const question_tags = require('./routes/')

const router = new KoaRouter();

router.use(async (ctx, next) => {
	Object.assign(ctx.state, {
		currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
		newSessionPath: ctx.router.url('newSession'),
		destroySessionPath: ctx.router.url('destroySession'),
		usersPath: ctx.router.url('users'),
		allQuestionsPath: ctx.router.url('allQuestions'),
		newQuestionPath: ctx.router.url('newQuestion'),
		tagsPath: ctx.router.url('tags'),
    	userPathHelper: user_id => ctx.router.url('user', user_id),
    	//
    	// selectTagsPathBuilder: (questionId) => ctx.router.url('selectTags', questionId)
    	// //
	});
	return next();
})

router.use('/', index.routes());
router.use('/hello', hello.routes());

router.use('/users', users.routes());
router.use('/session', session.routes());

router.use('/questions', questions.routes());

router.use('/answers', answers.routes());
router.use('/comments', comments.routes());

router.use('/tags', tags.routes());

// router.use('/questionTag')


module.exports = router;