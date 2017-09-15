const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const {user} = ctx.state;
  const questions = await user.getQuestions();
  await ctx.render('questions/index', {user, questions});
})

router.get('newQuestion', '/new', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.user.build();
	await ctx.render('questions/new', {
		user, 
		question,
		createQuestionPath: ctx.router.url('createQuestion');
	});
})

router.post('createQuestion', '/:id', async (ctx) => {
	const {user} = ctx.state;
	const question = await user.createQuestion(ctx.params.id);
	ctx.redirect(ctx.routes.url('questions'));
})

router.get('editQuestion', '/:id/edit', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.question.findById(ctx.params.id);
	await ctx.render('questions/edit', {
		user, 
		question,
		updateQuestionPath: ctx.router.url('updateQuestion');
	});
})

router.patch('updateQuestion', '/:id', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.question.findById(ctx.params.id);
	ctx.redirect(ctx.routes.url('questions'));
})

router.delete('deleteQuestion', '/:id', async (ctx) => {
  const {user} = ctx.state;
  await user.destroyQuestion({
    where: { id: ctx.params.id },
  });
  ctx.redirect(ctx.router.url('questions')); 
})

router.get('question', '/:id', async (ctx) => {
	const {user} = ctx.state;
	const question = user.findById(params.ctx.id);
	render('questions/show', {user, question});
})

module.exports = router;
