const KoaRouter = require('koa-router');

const router = new KoaRouter();

const tagsRouter = require('./tags')

router.get('exams', '/', async (ctx) => {
	const exams = await ctx.orm.exam.findAll();
	
	await ctx.render('exams/index', {
	  	exams,
	  	examPathBuilder: exam => 
	  		ctx.router.url('exam', {id: exam.id}),
	  	order: "Nombre",
	  	newExamPath: ctx.router.url('newExam'),
	  	currentUserAdmin: ctx.state.currentUserAdmin,
	  	upvoteExamPathBuilder: exam => ctx.router.url('upvoteExam', exam.id),
	  	downvoteExamPathBuilder: exam => ctx.router.url('downvoteExam', exam.id),
	});	
})


// router.use(
//   '/tags',
//   // async (ctx, next) => {
//   //   await next();
//   // },
//   tagsRouter.routes(),
// );


router.patch('upvoteExam', '/upvoteExam/:id', async (ctx) => {
	ctx.assert(ctx.state.currentUser, 401, "No ha iniciado sesión")
	const exam = await ctx.orm.exam.findById(ctx.params.id);
	let params = {
		examId: ctx.params.id, 
		userId: ctx.state.currentUser.id,
		isUpvote: true,
	}
	const existingVote = await ctx.orm.vote.find({where: params})
	console.log("existe voto?: ", !!existingVote)
	ctx.assert(!existingVote, 401, "No puede votar dos veces")
	params.isUpvote = false
	const existingDownvote = await ctx.orm.vote.find({where: params})
	if (existingDownvote){
		await ctx.orm.vote.destroy({where: params})
	} else {
	    params.isUpvote = true
	    const newVote = await ctx.orm.vote.create(params)
	}
	await exam.update({votes_sum: exam.votes_sum + 1})
	ctx.redirect(ctx.router.url('exams'));
})

router.patch('downvoteExam', '/downvoteExam/:id', async (ctx) => {
	ctx.assert(ctx.state.currentUser, 401, "No ha iniciado sesión")
	const exam = await ctx.orm.exam.findById(ctx.params.id);
	let params = {
		examId: ctx.params.id, 
		userId: ctx.state.currentUser.id,
		isUpvote: false
	}
	const existingVote = await ctx.orm.vote.find({where: params})
	ctx.assert(!existingVote, 401, "No puede votar dos veces")
	params.isUpvote = true
	const existingUpvote = await ctx.orm.vote.find({where: params})
	if (existingUpvote){
		await ctx.orm.vote.destroy({where: params})
	} else {
		params.isUpvote = false
		const newVote = await ctx.orm.vote.create(params)
	}
	await exam.update({votes_sum: exam.votes_sum - 1})
	ctx.redirect(ctx.router.url('exams'));
})


router.get('newExam', '/new', async (ctx) => {

	const currentUser = ctx.state.currentUser;
	const currentUserAdmin = currentUser && currentUser.admin
	ctx.assert(currentUserAdmin, 401, 'No tiene permiso para crear un examen')
	//if (!ctx.state.currentUser.admin) {
	if (currentUserAdmin) {

		const exam = await ctx.orm.exam.build();
		await ctx.render('exams/new', {
		// user: ctx.state.currentUser, 
		exam,
		submitExamPath: ctx.router.url('createExam')
		})

	} else {
		ctx.redirect(ctx.router.url('exams'));	
		
	}
})



router.post('createExam', '/createExam', async (ctx) => {
	console.log(ctx.request.body);
	try {
		ctx.request.body.votes_sum = 0
		console.log("\n\n\n ctx.request.body in createExam: ", ctx.request.body)
		const exam = await ctx.state.currentUser.createExam(ctx.request.body);
		
		ctx.redirect(ctx.router.url('exams'),
			{id: exam.id});
	} catch (validationError) {
			console.log(validationError);
		await ctx.render('exams/new', {
			// user: ctx.state.currentUser,

			errors: validationError.errors,
			exam: ctx.orm.exam.build(ctx.request.body),
			submitExamPath: ctx.router.url('createExam')
		})
	}
})


router.get('editExam', '/:id/edit', async (ctx) => {
	const exam = await ctx.orm.exam.findById(ctx.params.id);
	const author = await ctx.orm.user.findById(exam.userId);
	if (!ctx.state.currentUser) {
		ctx.redirect(ctx.router.url('exams'));
	} else {
		if (ctx.state.currentUser.admin || ctx.state.currentUser.id == author.id) {
			await ctx.render('exams/edit', {
				// user: ctx.state.currentUser, 
				exam,
				submitExamPath: ctx.router.url('updateExam',
					{id: exam.id})
			});
		} else {
			ctx.redirect(ctx.router.url('exams'));
		}
	}
})

router.patch('updateExam', '/:id', async (ctx) => {
	const exam= await ctx.orm.exam.findById(ctx.params.id);
	try {
	    await exam.update(ctx.request.body);
		ctx.redirect(ctx.router.url('exam', {id: exam.id}));
	} catch (validationError) {
		await ctx.render('exams/edit', {
			// user: ctx.state.currentUser,
			exam,
			submitExamPath: ctx.router.url('updateExam',
				{id: exam.id}),
	  		errors: validationError.errors		
		})
	}
})

router.delete('deleteExam', '/:id', async (ctx) => {
  const exam = await ctx.orm.exam.findById(ctx.params.id);
  const author = await ctx.orm.user.findById(exam.userId);
  if (!ctx.state.currentUser) {
  	ctx.redirect(ctx.router.url('allexams')); 
  } else {
  	if (ctx.state.currentUser.admin || ctx.state.currentUser.id == author.id) {
	  	await ctx.orm.exam.destroy({
	    where: { id: ctx.params.id },
	    });
	    ctx.redirect(ctx.router.url('exams')); 
  	} else {
  		ctx.redirect(ctx.router.url('exams')); 
  	}
  }
})







router.get('exam', '/:id', async (ctx) => {
	
	const exam = await ctx.orm.exam.findById(ctx.params.id);


	const modules = await ctx.orm.exammodule.findAll();
	

	
	


	await ctx.render('exams/show', {
		exam,
		modules,
	  	newModulePath:ctx.router.url('newModule', ctx.params.id)
	})
})









//modules




router.get('newModule', '/:examId/modules/new', async (ctx) => {


	//if (!ctx.state.currentUser.admin) {
	if (true) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);

		const mod = await ctx.orm.exammodule.build();
		console.log("carga_newModule");
		await ctx.render('exams/newModule', {
		// user: ctx.state.currentUser, 
		mod,
		exam,
		submitModulePath: ctx.router.url('createModule',{examId:ctx.params.examId})
		})

	} else {
		ctx.redirect(ctx.router.url('exams'));	
		
	}
})



router.post('createModule', '/:examId/modules/create', async (ctx) => {

	console.log("funciona");
	try {
		console.log("Exito1");
		const exam=await ctx.orm.exam.findById(ctx.params.examId);
		console.log("Exito2", exam.createExammodule);
		const mod = await exam.createExammodule(ctx.request.body);
		
		ctx.redirect(ctx.router.url('exams'),
			{id: mod.id});
		console.log("Exito3");
	} catch (validationError) {
		console.log("Error");

		const exam = await ctx.orm.exam.findById(ctx.params.examId);

		const mod = await ctx.orm.exammodule.build();

		await ctx.render('exams/newModule', {
		// user: ctx.state.currentUser, 
		mod, 
		exam,
		submitModulePath: ctx.router.url('createModule',{examId:ctx.params.examId})
		})
	}
})




router.get('module', '/:examId/modules/:moduleId', async (ctx) => {
	
	const exam = await ctx.orm.exam.findById(ctx.params.examId);

	console.log("AQUI",ctx.orm.exammodule)
	

	const module = await ctx.orm.exammodule.findById(ctx.params.examId);

	const examquestions = await ctx.orm.examquestion.findAll({where: {exammoduleId:ctx.params.moduleId}});
	

	


	await ctx.render('exams/showModule', {
		exam,
		module,
		examquestions,
	  	newExamQuestionPath:ctx.router.url('newExamQuestion', {examId:ctx.params.examId, moduleId:ctx.params.moduleId})
	})
})







//examquestions





router.get('newExamQuestion', '/:examId/modules/:moduleId/examquestions/new', async (ctx) => {


	//if (!ctx.state.currentUser.admin) {
	if (true) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);

		const mod = await ctx.orm.exammodule.findById(ctx.params.moduleId);

		const question = await ctx.orm.examquestion.build();

		console.log("carga_newModule");
		await ctx.render('exams/newExamQuestion', {
		// user: ctx.state.currentUser, 
		mod,
		exam,
		question,
		submitExamQuestionPath: ctx.router.url('createExamQuestion',{examId:ctx.params.examId, moduleId:ctx.params.moduleId})
		})

	} else {
		ctx.redirect(ctx.router.url('exams'));	
		
	}
})







router.post('createExamQuestion', '/:examId/modules/:moduleId/examquestions/create', async (ctx) => {

	console.log("funciona");
	try {
		console.log("Exito1");
		const mod=await ctx.orm.exammodule.findById(ctx.params.moduleId);
		console.log("Exito2", mod);
		const question = await mod.createExamquestion(ctx.request.body);
		
		ctx.redirect(ctx.router.url('exams'),
			{id: mod.id});
		console.log("Exito3");
	} catch (validationError) {




		const exam = await ctx.orm.exam.findById(ctx.params.examId);


		const module = await ctx.orm.exammodule.findById(ctx.params.moduleId);
	

		
		const question = await ctx.orm.examquestion.build();


		await ctx.render('exams/newExamQuestion', {
			module,
			exam,
			question,
		  	submitExamQuestionPath: ctx.router.url('createExamQuestion',{examId:ctx.params.examId, moduleId:ctx.params.moduleId})
		})

		
	}
})







router.get('examquestion', '/:examId/modules/:moduleId/examquestions/:examQuestionId', async (ctx) => {
	
	const exam = await ctx.orm.exam.findById(ctx.params.examId);

	const module = await ctx.orm.exammodule.findById(ctx.params.moduleId);

	

	const question = await ctx.orm.examquestion.findById(ctx.params.examQuestionId);


	const answers = await ctx.orm.examanswer.findAll({where:{examquestionId:ctx.params.examQuestionId}});
	

	
	await ctx.render('exams/showExamQuestion', {
		exam,
		module,
		question,
		answers,
	  	newExamAnswerPath:ctx.router.url('newExamAnswer', {examId:ctx.params.examId, moduleId:ctx.params.moduleId, examQuestionId:ctx.params.examQuestionId})
	})
})





//answers








router.get('newExamAnswer', '/:examId/modules/:moduleId/examquestions/:examQuestionId/examanswers/new', async (ctx) => {


	//if (!ctx.state.currentUser.admin) {
	if (true) {


		const question = await ctx.orm.examquestion.findById(ctx.params.examQuestionId);

		const answer= await ctx.orm.examanswer.build();

		await ctx.render('exams/newExamAnswer', {
	
		question,
		answer,
		submitExamAnswerPath: ctx.router.url('createExamAnswer',{examId:ctx.params.examId, moduleId:ctx.params.moduleId, examQuestionId:ctx.params.examQuestionId})
		})

	} else {
		ctx.redirect(ctx.router.url('exams'));	
		
	}
})







router.post('createExamAnswer', '/:examId/modules/:moduleId/examquestions/:examQuestionId/examanswers/create', async (ctx) => {

	console.log("funciona");
	try {
		console.log("Exito1");
		const question=await ctx.orm.examquestion.findById(ctx.params.examQuestionId);
		console.log("Exito2", question.createExamanswer);
		const answer = await question.createExamanswer(ctx.request.body);
		console.log("Entre2y3");
		ctx.redirect(ctx.router.url('exams'));
		console.log("Exito3");

	} catch (validationError) {




		const question = await ctx.orm.examquestion.findById(ctx.params.examQuestionId);

		const answer= await ctx.orm.examanswer.build();

		await ctx.render('exams/newExamAnswer', {
	
		question,
		answer,
		submitExamAnswerPath: ctx.router.url('createExamAnswer',{examId:ctx.params.examId, moduleId:ctx.params.moduleId, examQuestionId:ctx.params.examQuestionId})
		})

		
	}
})


// tagexams

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



module.exports = router;


