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
		ctx.redirect(ctx.router.url('question'),
			{id: question.id});
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

  // if question doesn't exist, an error must be thrown
  ctx.assert(question, 404, 'No existe la pregunta pedida', {
    id: ctx.params.id
  })
  const tagquestions = await question.getTagquestions();
  const tags = []
  const add = async (tq) => {
    const t = await ctx.orm.tag.findById(tq.tagId)
    tags.push(t)
  }
  for (let j = 0; j < tagquestions.length; j++){
    await add(tagquestions[j])
  }

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
		toCommentPath: '/questions/'+question.id+'/answers/',
    //
    selectTagsPath: ctx.router.url('selectTags', ctx.params.id),
    tags,
    //
	})
})


router.get('newAnswer', '/:id/answers/new', async (ctx) => {
  console.log("NEW ANSWER");
  console.log('questions/'+ctx.params.id);
  const user=ctx.state.currentUser;
  const answer = await ctx.orm.answer.build();
  
  await ctx.render('answers/new', {
    user,
    answer,
    submitAnswerPath: ctx.router.url('createAnswer',{userId:user.id,questionId:ctx.params.id}),
    questionPath:ctx.router.url('questions/:id',{userId:user.id}),
    questionId:ctx.params.id
  });
})

// copied

router.get('selectTags', '/:id/selectTags', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id)
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/select', {
    tags,
    question,
    createTagquestionPathBuilder: tag => 
      ctx.router.url('createTagquestion', {
        id: ctx.params.id,
        tagId: tag.id
      })
  });
})  

router.post('createTagquestion', '/:id/tagquestions/:tagId', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id)
  const tag = await ctx.orm.tag.findById(ctx.params.tagId)
  ctx.assert(question, 404, 'No hay pregunta', {id: ctx.params.questionId})
  ctx.assert(tag, 404, 'No hay tag', {id: ctx.params.id})
  const tagquestion = await ctx.orm.tagquestion.create();
  tagquestion.setQuestion(question)
  tagquestion.setTag(tag)
  ctx.redirect(ctx.router.url('question', {id: ctx.params.id}))
})




router.get('answers', '/', async (ctx) => {
  
  const answers = await ctx.orm.answer.findAll();
  await ctx.render('answers/index', {
    
    answers,
    answerPathBuilder:answer=>
      ctx.router.url('answer',{
        id:answer.id}),
      order:"Nombre"


  });
})







router.post('createAnswer', '/:questionId/answers/create', async (ctx) => {
	console.log("CREATE ANSWER");
  const user=ctx.state.currentUser;

  const questionId=ctx.params.id;

  try{
  	const question = await ctx.orm.question.findById(ctx.params.questionId);
    
    await question.createAnswer(ctx.request.body);
    
    
  	ctx.redirect(ctx.router.url('question', {id: question.id}));

  } catch(validationError){

    await ctx.render('answers/new',{
    
      errors:validationError.errors,
      
      submitAnswerPath: ctx.router.url('createAnswer/'+questionId,{userId:user.id,questionId:questionId}),
      
      questionId:questionId
    })
  }
  
})







router.get('editAnswer', '/:id/edit', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await ctx.render('answers/edit', {
    user,
    answer, 
    submitAnswerPath: ctx.router.url('updateAnswer', {userId:answer.userId, id:answer.id}),
    answersPath:ctx.router.url('answers',{userId:user.id})
  })
})






router.patch('updateAnswer', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await answer.update(ctx.request.body);
  ctx.redirect(ctx.router.url('answers'));




  try {
      await answer.update(ctx.request.body);
    ctx.redirect(ctx.router.url('answers', {userId: user.id}));
  } catch (validationError) {
    await ctx.render('answers/edit', {
      user,
      answer,
      submitAnswerPath: ctx.router.url('updateAnswer',
        {userId: answer.userId, id: answer.id}),
        errors: validationError.errors,
      answersPath: ctx.router.url('answers', 
        {userId: user.id})      
    })
  }
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
        {userId: question.userId, id: question.id}),
        errors: validationError.errors,
      questionsPath: ctx.router.url('questions', 
        {userId: user.id})      
    })
  }
})




router.get('answer', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await ctx.render('answers/show', {
    user,
    answer,
    deleteAnswerPath: ctx.router.url('deleteAnswer', {userId:question.userId,id:question.id}),
    editAnswerPath: ctx.router.url('editAnswer',{userId:question.userId,id:question.id}),
    answersPath: ctx.router.url('answers',{userId:question.userId})
  })
})




router.delete('deleteAnswer', '/:id', async (ctx) => {
  const {user}=ctx.state;
  const question=await ctx.orm.answer.findById(ctx.params.id);
  await ctx.orm.answer.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('answers',{userId:user.id}));  
})










router.get('comments', '/', async (ctx) => {
  const comments = await ctx.orm.comment.findAll();
  await ctx.render('comments/index', {comments});
})




router.get('newComment', '/:questionId/answers/:answerId/comments/new', async (ctx) => {
  const comment = await ctx.orm.comment.build();
  await ctx.render('comments/new', {
    comment,
    submitCommentPath: ctx.router.url('createComment',{questionId:ctx.params.questionId, answerId:ctx.params.answerId}),
    questionId:ctx.params.questionId
  });
})





router.post('createComment', '/:questionId/answers/:answerId/comments/create', async (ctx) => {
 

  try{
  	const answer = await ctx.orm.answer.findById(ctx.params.answerId);
    
    await answer.createComment(ctx.request.body);
    
  	ctx.redirect(ctx.router.url('question', {id: ctx.params.questionId}));



  } catch(validationError){

    await ctx.render('comment/new',{
    
      errors:validationError.errors,
      
      submitCommentPath: ctx.router.url('createcomment',{questionId:ctx.params.questionId, answerId:ctx.params.answerId}),
      
      questionId:ctx.params.questionId
    })
  }
})

router.get('editcomment', '/:id/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await ctx.render('comments/edit', {
    comment, 
    updatecommentPath: ctx.router.url('updatecomment', comment.id),
  })
})

router.patch('updatecomment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await comment.update(ctx.request.body);
  ctx.redirect(ctx.router.url('comments'));
})


router.get('comment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await ctx.render('comments/show', {
    comment,
    deletecommentPath: ctx.router.url('deletecomment', comment.id),
  });
})

router.delete('deletecomment', '/:id', async (ctx) => {
  await ctx.orm.comment.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('comments'));  
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
