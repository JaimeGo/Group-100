const KoaRouter = require('koa-router');

const router = new KoaRouter();

// adding tags of a tagquestion
const getTagOfTagquestion = async (tags, tq) => {
  const t = await ctx.orm.tag.findById(tq.tagId)
  tags.push(t)
}

const getTagsOfTagquestions = async (tags, tagquestions) => {
    for (let j = 0; j < tagquestions.length; j++){
    await getTagOfTagquestion(tags, tagquestions[j])
  }
}

//

router.get('allQuestions', '/', async (ctx) => {
	const questions = await ctx.orm.question.findAll();
  console.log('\n\n\n\nctx.session.searchInfo in allQuestions: ', ctx.session.searchInfo)
	await ctx.render('questions/indexAll', {
	  	questions,
	  	questionPathBuilder: question => 
	  		ctx.router.url('question', {id: question.id}),
	  	order: "Nombre",
      //
      tagsInfo: ctx.state.tagsInfo,
      questionsInfo: ctx.state.questionsInfo,
      searchInfo: ctx.session.searchInfo,
      updateActiveTagsPath: ctx.router.url('updateActiveTags'),
      updateSearchPath: ctx.router.url('updateSearch')
      //
	});	
})

//added from tags (it could be added to tags router)
router.post('updateActiveTags', '/active_tags', (ctx) => {
  const tagsIds = []
  const newActiveTags = {}
  console.log("Antes de foreach")
  if (!ctx.request.body.active) {
    ctx.request.body.active = [] 
  }
  Object.keys(ctx.state.tagsInfo).forEach(activeTagId => {
    console.log(activeTagId, (ctx.request.body.active.indexOf(activeTagId) >= 0))
    newActiveTags[activeTagId] = 
      (ctx.request.body.active.indexOf(activeTagId) >= 0)
  })
  console.log("newActiveTags", newActiveTags)
  Object.keys(newActiveTags).forEach(async id => {
    let tag = await ctx.orm.tag.findById(id)
    console.log('active', newActiveTags[id])
    await tag.update({active: newActiveTags[id],
      _method: 'patch', update: 'modify Tag'})
  })
  ctx.redirect(ctx.router.url('allQuestions'))
})

//


// added for searching
router.post('updateSearch', '/search', (ctx) => {
  ctx.session.searchInfo = ctx.request.body.item,
  ctx.redirect(ctx.router.url('allQuestions'))
})


router.get('modifiedAllQuestions', '/modified/:modifiedBy', async (ctx) => {
	const questions = await ctx.orm.question.findAll();
  await ctx.render('questions/indexAll', {
	  	questions,
	  	questionPathBuilder: question => 
	  		ctx.router.url('question', {id: question.id}),
	  	order: ctx.params.modifiedBy
	});	
})

router.get('newQuestion', '/new', async (ctx) => {
  console.log('ctx.state.tagsInfo en newQuestion', 
    ctx.state.tagsInfo)
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
    console.log('body de request en update de question', ctx.request.body)
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
// <<<<<<< HEAD
// 		toCommentPath: '/questions/'+question.id+'/answers/'
// =======
		toCommentPath: '/questions/'+question.id+'/answers/',
    //
    selectTagsPath: ctx.router.url('selectTags', ctx.params.id),
    tags,
    deleteTagquestionPathBuilder: tag => 
      ctx.router.url("deleteTagquestion", {
        id: ctx.params.id,
        tagId: tag.id
      })
    //
// >>>>>>> tags_new
	})
})


router.get('newAnswer', '/:id/answers/new', async (ctx) => {
  
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
  const tags_ids = tags.map((i) => i.id)
//
  const tagquestions = await question.getTagquestions();
  const tags_associated = []
  const tags_no_associated = []
  const add = async (tq) => {
    const t = await ctx.orm.tag.findById(tq.tagId)
    tags_associated.push(t)
  }
  for (let j = 0; j < tagquestions.length; j++){
    await add(tagquestions[j])
  }

  const tags_associated_ids = tags_associated.map((i) => i.id)

  for (let k = 0; k < tags_ids.length; k++){
    console.log("index: ", tags_ids)
    if (tags_associated_ids.indexOf(tags_ids[k]) < 0){
      tags_no_associated.push(tags[k])
    }
  }

//

  await ctx.render('tags/select', {
    tags,
    tags_no_associated,
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
  const user = await ctx.state.currentUser
  ctx.assert(question, 404, 'No hay pregunta', {id: ctx.params.questionId})
  ctx.assert(tag, 404, 'No hay tag', {id: ctx.params.id})
  ctx.assert(user, 401, 'No hay sesión iniciada')
  const tagquestion = await ctx.orm.tagquestion.create({userId: user.id});
  tagquestion.setQuestion(question)
  tagquestion.setTag(tag)
  ctx.redirect(ctx.router.url('question', {id: ctx.params.id}))
})

router.delete('deleteTagquestion', '/:id/tagquestions/:tagId', async (ctx) => {
  await ctx.orm.tagquestion.destroy({
      where: { 
        tagId: ctx.params.tagId,
        questionId: ctx.params.id,
       }
      });
  ctx.redirect(ctx.router.url('question', ctx.params.id)); 
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

router.get('editComment', '/:questionId/answers/:answerId/comments/:commentId/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.commentId);
  await ctx.render('comments/edit', {
    comment, 
    updateCommentPath: ctx.router.url('updateComment', ctx.params.questionId, ctx.params.answerId,ctx.params.commentId),
  })

})

router.patch('updateComment', '/:questionId/answers/:answerId/comments/:commentId/update', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.commentId);
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

router.delete('deleteComment', '/:questionId/answers/:answerId/comments/:commentId/delete', async (ctx) => {
  await ctx.orm.comment.destroy({
    where: { id: ctx.params.commentId },
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
