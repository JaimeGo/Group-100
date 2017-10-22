const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('exams', '/', async (ctx) => {
	const exams = await ctx.orm.exam.findAll();
	await ctx.render('exam/indexAll', {
	  	exams,
	  	examPathBuilder: exam => 
	  		ctx.router.url('exam', {id: exam.id}),
	  	order: "Nombre"
	});	
})



router.get('newExam', '/new', async (ctx) => {
	if (!ctx.state.currentUser) {
		ctx.redirect(ctx.router.url('exams'));		
	} else {
		const exam = await ctx.orm.exam.build();
		await ctx.render('questions/new', {
		// user: ctx.state.currentUser, 
		exam,
		submitExamPath: ctx.router.url('createExam')
		})
	}
})

router.post('createExam', '/', async (ctx) => {
	try {
		const exam = await ctx.state.currentUser.createExam(ctx.request.body);
		ctx.redirect(ctx.router.url('exam'),
			{id: exam.id});
	} catch (validationError) {
		await ctx.render('exam/new', {
			// user: ctx.state.currentUser,
			errors: validationError.errors,
			question: ctx.orm.exam.build(ctx.request.body),
			submitExamPath: ctx.router.url('createExam')
		})
	}
})

router.get('editQuestion', '/:id/edit', async (ctx) => {
	const question = await ctx.orm.question.findById(ctx.params.id);
	const author = await ctx.orm.user.findById(question.userId);
	if (!ctx.state.currentUser) {
		ctx.redirect(ctx.router.url('allQuestions'));
	} else {
		if (ctx.state.currentUser.admin || ctx.state.currentUser.id == author.id) {
			await ctx.render('questions/edit', {
				// user: ctx.state.currentUser, 
				question,
				submitQuestionPath: ctx.router.url('updateQuestion',
					{id: question.id})
			});
		} else {
			ctx.redirect(ctx.router.url('allQuestions'));
		}
	}
})

router.patch('updateQuestion', '/:id', async (ctx) => {
	const question = await ctx.orm.question.findById(ctx.params.id);
	try {
	    await question.update(ctx.request.body);
		ctx.redirect(ctx.router.url('question', {id: question.id}));
	} catch (validationError) {
		await ctx.render('questions/edit', {
			// user: ctx.state.currentUser,
			question,
			submitQuestionPath: ctx.router.url('updateQuestion',
				{id: question.id}),
	  		errors: validationError.errors		
		})
	}
})

router.delete('deleteQuestion', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  const author = await ctx.orm.user.findById(question.userId);
  if (!ctx.state.currentUser) {
  	ctx.redirect(ctx.router.url('allQuestions')); 
  } else {
  	if (ctx.state.currentUser.admin || ctx.state.currentUser.id == author.id) {
	  	await ctx.orm.question.destroy({
	    where: { id: ctx.params.id },
	    });
	    ctx.redirect(ctx.router.url('allQuestions')); 
  	} else {
  		ctx.redirect(ctx.router.url('allQuestions')); 
  	}
  }
})







router.get('question', '/:id', async (ctx) => {
	
	const question = await ctx.orm.question.findById(ctx.params.id);

	const answers = await ctx.orm.answer.findAll({where:{questionId:ctx.params.id}});
	const allComments = await ctx.orm.comment.findAll();


	let comments=[];

	
	answers.forEach((answer) => {
		const rightComments=allComments.filter((comment)=>{return comment.answerId===answer.id;});
		
		const someComments= {answerId: answer.id,
			content: rightComments};

		comments.push(someComments);



	});

	const author = await ctx.orm.user.findById(question.userId);
	let currentUserAdmin = false;
	if (ctx.state.currentUser && ctx.state.currentUser.admin){
		currentUserAdmin = true;
	}
	let currentUserAuthor = false;
	if (ctx.state.currentUser && ctx.state.currentUser.id == author.id){
		currentUserAuthor = true;
	}


	await ctx.render('questions/show', {
		author,
		currentUserAdmin, 
		currentUserAuthor,
		// currentUser: ctx.state.currentUser,
		question,
		answers,
		comments,
		deleteQuestionPath: ctx.router.url('deleteQuestion', 
			{id: question.id}),
		editQuestionPath: ctx.router.url('editQuestion',
			{id: question.id}),
		newAnswerPath: ctx.router.url('newAnswer',
			{id: question.id}),
		toCommentPath: '/questions/'+question.id+'/answers/'
	})
})

module.exports = router;
