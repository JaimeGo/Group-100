const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('allQuestions', '/', async (ctx) => {
	const questions = await ctx.orm.question.findAll();
	await ctx.render('questions/indexAll', {
	  	questions,
	  	questionPathBuilder: question => 
	  		ctx.router.url('question', {id: question.id}),
	  	order: "Nombre"
	});	
})

router.get('sortedAllQuestions', '/sort/:sortBy', async (ctx) => {
	const questions = await ctx.orm.question.findAll();
	await ctx.render('questions/indexAll', {
	  	questions,
	  	questionPathBuilder: question => 
	  		ctx.router.url('question', {id: question.id}),
	  	order: ctx.params.sortBy
	});	
})

router.get('newQuestion', '/new', async (ctx) => {
	if (!ctx.state.currentUser) {
		ctx.redirect(ctx.router.url('allQuestions'));		
	} else {
		const question = await ctx.orm.user.build();
		await ctx.render('questions/new', {
		// user: ctx.state.currentUser, 
		question,
		submitQuestionPath: ctx.router.url('createQuestion')
		})
	}
})

router.post('createQuestion', '/', async (ctx) => {
	try {
		const question = await ctx.state.currentUser.createQuestion(ctx.request.body);
		ctx.redirect(ctx.router.url('allQuestions'));
	} catch (validationError) {
		await ctx.render('questions/new', {
			// user: ctx.state.currentUser,
			errors: validationError.errors,
			question: ctx.orm.user.build(ctx.request.body),
			submitQuestionPath: ctx.router.url('createQuestion')
		})
	}
})

router.get('editQuestion', '/:id/edit', async (ctx) => {
	const question = await ctx.orm.question.findById(ctx.params.id);
	const author = await ctx.orm.user.findById(question.userId);
	if (!ctx.state.currentUser) {
		ctx.redirect(ctx.router.url('allQuestions'));
	} else {
		if (ctx.state.currentUser.admin || ctx.state.currentUser == author) {
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
		ctx.redirect(ctx.router.url('allQuestions'));
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
  	if (ctx.state.currentUser.admin || ctx.state.currentUser == author) {
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
	const question = await ctx.orm.question.findById(ctx.params.id)
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
		deleteQuestionPath: ctx.router.url('deleteQuestion', 
			{id: question.id}),
		editQuestionPath: ctx.router.url('editQuestion',
			{id: question.id})
	})
})







// router.get('questions', '/:sort', async (ctx) => {
//  //  const {user} = ctx.state;
//  //  let questions = await ctx.orm.question.findAll();
//  //  if (user) {
// 	// questions = await user.getQuestions();
//  //  }
//  // ORIGINAL VERSION
//   const {user} = ctx.state;
//   const questions = await user.getQuestions();
//   await ctx.render('questions/index', {
//   	user, 
//   	questions,
//   	questionPathBuilder: question => 
//   		ctx.router.url('question', {userId: question.userId,
//   			id: question.id}),
//   	userPath: ctx.router.url('user', {id: user.id}),
//   	newQuestionPath: ctx.router.url('newQuestion', {userId: user.id}),
//   	// added for sorting
//   	order: "Nombre",
//   	sortedQuestionsPathBuilder: sorting => 
//   		ctx.router.url('sortedQuestions', 
//   			{userId: user.id, sortBy: sorting})
//   });
// })

// router.get('sortedQuestions', '/sort/:sortBy', async(ctx) => {
//   const {user} = ctx.state;
//   const questions = await user.getQuestions();
//   await ctx.render('questions/index', {
//   	user, 
//   	questions,
//   	questionPathBuilder: question => 
//   		ctx.router.url('question', {userId: question.userId,
//   			id: question.id}),
//   	userPath: ctx.router.url('user', {id: user.id}),
//   	newQuestionPath: ctx.router.url('newQuestion', {userId: user.id}),
//   	// added for sorting
//   	order: ctx.params.sortBy,
//   	sortedQuestionsPathBuilder: sorting => 
//   		ctx.router.url('sortedQuestions', 
//   			{userId: user.id, sortBy: sorting})
//   	});
// })

// router.get('newQuestion', '/new', async (ctx) => {
// 	if (!currentUser) {
// 		ctx.redirect(ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'}));		
// 	} else {
// 		const {user} = ctx.state;
// 		const question = await ctx.orm.user.build();
// 		await ctx.render('questions/new', {
// 			user, 
// 			question,
// 			submitQuestionPath: ctx.router.url('createQuestion',
// 			{userId: user.id}),
// 			questionsPath: ctx.router.url('questions', 
// 				{userId: user.id, sort: 'default'})
// 		});
// 	}
// })

// router.post('createQuestion', '/', async (ctx) => {
// 	const {user} = ctx.state;
// 	try {
// 		const question = await user.createQuestion(ctx.request.body);
// 		ctx.redirect(ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'}));
// 	} catch (validationError) {
// 		await ctx.render('questions/new', {
// 			user,
// 			errors: validationError.errors,
// 			question: ctx.orm.user.build(ctx.request.body),
// 			submitQuestionPath: ctx.router.url('createQuestion',
// 				{userId: user.id}),
// 			questionsPath: ctx.router.url('questions', 
// 				{userId: user.id})	
// 		})
// 	}
// })

// router.get('editQuestion', '/:id/edit', async (ctx) => {
// 	const {user} = ctx.state;
// 	const question = await ctx.orm.question.findById(ctx.params.id);
// 	await ctx.render('questions/edit', {
// 		user, 
// 		question,
// 		submitQuestionPath: ctx.router.url('updateQuestion',
// 			{userId: question.userId, id: question.id}),
// 		questionsPath: ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'})
// 	});
// })

// router.patch('updateQuestion', '/:id', async (ctx) => {
// 	const {user} = ctx.state;
// 	const question = await ctx.orm.question.findById(ctx.params.id);
// 	try {
// 	    await question.update(ctx.request.body);
// 		ctx.redirect(ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'}));
// 	} catch (validationError) {
// 		await ctx.render('questions/edit', {
// 			user,
// 			question,
// 			submitQuestionPath: ctx.router.url('updateQuestion',
// 				{userId: question.userId, id: question.id}),
// 	  		errors: validationError.errors,
// 			questionsPath: ctx.router.url('questions', 
// 				{userId: user.id})			
// 		})
// 	}
// })

// router.delete('deleteQuestion', '/:id', async (ctx) => {
//   const {user} = ctx.state;
//   const question = await ctx.orm.question.findById(ctx.params.id);
//   await ctx.orm.question.destroy({
//     where: { id: ctx.params.id },
//   });
//   ctx.redirect(ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'})); 
// })

// router.get('question', '/:id', async (ctx) => {
// 	const {user} = ctx.state;
// 	const questions = await user.getQuestions({
// 		where: {id: ctx.params.id}
// 	});
// 	const question = questions[0];
// 	await ctx.render('questions/show', {
// 		user, 
// 		question,
// 		deleteQuestionPath: ctx.router.url('deleteQuestion', 
// 			{userId: question.userId, id: question.id}),
// 		editQuestionPath: ctx.router.url('editQuestion',
// 			{userId: question.userId, id: question.id}),
// 		questionsPath: ctx.router.url('questions', 
// 			{userId: user.id, sort: 'default'})
// 	})
// })

module.exports = router;
