const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');

const users = require('./routes/users');
const session = require('./routes/session')

const questions = require('./routes/questions')

const answers = require('./routes/answers')
const comments = require('./routes/comments')

// <<<<<<< HEAD
const exams = require('./routes/exams')
// =======
const tags = require('./routes/tags')
// const question_tags = require('./routes/')
// >>>>>>> tags_new

const router = new KoaRouter();

// get the tags ids with active status
const getInfoFromTags = (tags) => {
	const infoFromTags = {}
	tags.forEach(tag => {
		const tagId = tag.id
		infoFromTags[tagId] = {name: tag.name, active: tag.active}
	})
	return infoFromTags
}
//

const getInfoFromQuestions = async (questions) => {
	const infoFromQuestions = {}
	const addQuestion = async(question) => {
	   const questionId = question.id
	   const tagquestions = await question.getTagquestions()
       infoFromQuestions[questionId] = 
       {
       	tagsId: tagquestions.map(tq => tq.tagId.toString()),
       }
	}
	for (let j = 0; j < questions.length; j++){
	   await addQuestion(questions[j])
	}
	return infoFromQuestions
}
//

//
const getToShowFromQuestions = (questionsInfo, tagsInfo) => {
	const activeTags = Object.keys(tagsInfo).filter(id => tagsInfo[id].active)
	Object.keys(questionsInfo).forEach(key => {
		questionsInfo[key].toShow = 
			activeTags.every(value => 
				(questionsInfo[key].tagsId.indexOf(value) >= 0))
	})
}
//

router.use(async (ctx, next) => {
	const tags = await ctx.orm.tag.findAll()
	const tagsInfo = getInfoFromTags(tags)
	const questions = await ctx.orm.question.findAll()
	const questionsInfo = await getInfoFromQuestions(questions)
	getToShowFromQuestions(questionsInfo, tagsInfo)
	const searchInfo = null
	Object.assign(ctx.state, {
		searchInfo,
		tagsInfo,
		questionsInfo,
		currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
		newSessionPath: ctx.router.url('newSession'),
		destroySessionPath: ctx.router.url('destroySession'),
		usersPath: ctx.router.url('users'),
		allQuestionsPath: ctx.router.url('allQuestions'),
		newQuestionPath: ctx.router.url('newQuestion'),
		tagsPath: ctx.router.url('tags'),
		updateSearchPath: ctx.router.url('updateSearch'),
    	userPathHelper: user_id => ctx.router.url('user', user_id),
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

// <<<<<<< HEAD
router.use('/exams', comments.routes());
// =======
router.use('/tags', tags.routes());

// router.use('/questionTag')
// >>>>>>> tags_new


module.exports = router;