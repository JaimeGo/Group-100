const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const {user} = ctx.state;
  const questions = await user.getQuestions();
  await ctx.render('questions/index', {
  	user, 
  	questions,
  	questionPathBuilder: question => 
  		ctx.router.url('question', {userId: question.userId,
  			id: question.id}),
  	userPath: ctx.router.url('user', {id: user.id}),
  	newQuestionPath: ctx.router.url('newQuestion', {userId: user.id})
  });
})

router.get('newQuestion', '/new', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.user.build();
	await ctx.render('questions/new', {
		user, 
		question,
		submitQuestionPath: ctx.router.url('createQuestion',
		{userId: user.id}),
		questionsPath: ctx.router.url('questions', {userId: user.id})
	});
})

router.post('createQuestion', '/', async (ctx) => {
	const {user} = ctx.state;
	try {
		const question = await user.createQuestion(ctx.request.body);
		ctx.redirect(ctx.router.url('questions', {userId: user.id}));
	} catch (validationError) {
		await ctx.render('questions/new', {
			user,
			errors: validationError.errors,
			question: ctx.orm.user.build(ctx.request.body),
			submitQuestionPath: ctx.router.url('createQuestion',
				{userId: user.id})
		})
	}
})

router.get('editQuestion', '/:id/edit', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.question.findById(ctx.params.id);
	await ctx.render('questions/edit', {
		user, 
		question,
		submitQuestionPath: ctx.router.url('updateQuestion',
			{userId: question.userId, id: question.id}),
		questionsPath: ctx.router.url('questions', {userId: user.id})
	});
})

router.patch('updateQuestion', '/:id', async (ctx) => {
	const {user} = ctx.state;
	const question = await ctx.orm.question.findById(ctx.params.id);
	try {
	    await question.update(ctx.request.body);
		ctx.redirect(ctx.router.url('questions', {userId: user.id}));
	} catch (validationError) {
		await ctx.render('questions/edit', {
			user,
			question,
			submitQuestionPath: ctx.router.url('updateQuestion',
				{userId: question.userId,
	  			id: question.id}),
	  		errors: validationError.errors			
		})
	}
})

router.delete('deleteQuestion', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const question = await ctx.orm.question.findById(ctx.params.id);
  await ctx.orm.question.destroy({
    where: { id: ctx.params.id },
  });
  ctx.redirect(ctx.router.url('questions', {userId: user.id})); 
})

router.get('question', '/:id', async (ctx) => {
	const {user} = ctx.state;
	const questions = await user.getQuestions({
		where: {id: ctx.params.id}
	});
	const question = questions[0];
	await ctx.render('questions/show', {
		user, 
		question,
		deleteQuestionPath: ctx.router.url('deleteQuestion', 
			{userId: question.userId, id: question.id}),
		editQuestionPath: ctx.router.url('editQuestion',
			{userId: question.userId, id: question.id}),
		questionsPath: ctx.router.url('questions',
			{userId: question.userId})
	})
})

module.exports = router;
