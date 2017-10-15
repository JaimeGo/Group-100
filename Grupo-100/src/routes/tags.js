const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('tags', '/', async (ctx) => {
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/index', {
    tags,
    tagPathBuilder: (tag) => ctx.router.url('tag', tag.id), 
     });
})

router.get('newTag', '/new', async (ctx) => {
	const tag = await ctx.orm.tag.build()
	await ctx.render('tags/new', {
	    tag,
		submitTagPath: ctx.router.url('createTag')
	})
})

router.post('createTag', '/', async (ctx) => {
	try {
		const tag = await ctx.orm.tag.create(ctx.request.body);
		ctx.redirect(ctx.router.url('tags'))
	} catch (validationError) {
		const tag = await ctx.orm.tag.build()
		await ctx.render('tags/new', {
			errors: validationError.errors,
		    tag,
			submitTagPath: ctx.router.url('createTag')
		})
	}
})

router.get('selectTags', '/questions/:questionId/selectTags', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.questionId)
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/select', {
    tags,
    question,
	// associateTagsBuilder: (tag, questionId) => {
	// 	ctx.router.url('associateTags', {questionId, id: tag.id})
 //  	} 
 	// associateTagsBuilder: (tag, questionId) => {
		// ctx.router.url('createTagquestion')
  // 	} 
  	newTagquestionPathBuilder: (tag, question) =>
  		ctx.router.url('newTagquestion', {
  			id: tag.id,
  			questionId: question.id
  		})
  });
})	


// hay que hacerlo...
router.get('tagquestions', '/tagquestions', async (ctx) => {
  const tagquestions = await ctx.orm.tagquestion.findAll();
  await ctx.render('tagquestions/index', {
    tagquestions,
    deleteTagquestionPathBuilder: (tagquestion) => ctx.router.url('deleteTagquestion', tagquestion)
     });
})

// router.get('newTagquestion', '/tagquestions/new', async (ctx) => {
// 	const tagquestion = await ctx.orm.tagquestion.build()
// 	await ctx.render('tagquestions/new', {
// 	    tagquestion,
// 		submitTagquestionPath: ctx.router.url('createTagquestion')
// 	})
// })

router.get('newTagquestion', '/:id/questions/:questionId/tagquestions/new', async (ctx) => {
	const tagquestion = await ctx.orm.tagquestion.build({
		questionId: ctx.params.questionId,
		tagId: ctx.params.id,
	})
	await ctx.render('tagquestions/new', {
	    tagquestion,
	    tagId: ctx.params.id,
	    questionId: ctx.params.questionId,
		// submitTagquestionPath: ctx.router.url('createTagquestion'),
		submitTagquestionPathBuilder: (tagId, questionId) => 
			ctx.router.url('createTagquestion', {
				id: tagId,
				questionId
			})
	})
})

router.post('createTagquestion', '/:id/questions/:questionId/tagquestions', async (ctx) => {
	try {
		const tagquestion = await ctx.orm.tagquestion.create();
		const question = await ctx.orm.question.findById(ctx.params.questionId)
		const tag = await ctx.orm.tag.findById(ctx.params.id)
		tagquestion.setQuestion(question)
		tagquestion.setTag(tag)
		ctx.redirect(ctx.router.url('tags'))
	} catch (validationError) {
		const tagquestion = await ctx.orm.tagquestion.build()
		await ctx.render('tagquestion/new', {
			errors: validationError.errors,
		    tagquestion,
			submitTagquestionPath: ctx.router.url('createTagquestion')
		})
	}
})

// router.post('createTagquestion', '/tagquestions', async (ctx) => {
// 	try {
// 		const tagquestion = await ctx.orm.tagquestion.create(ctx.request.body);
// 		ctx.redirect(ctx.router.url('tagquestions'))
// 	} catch (validationError) {
// 		const tagquestion = await ctx.orm.tagquestion.build()
// 		await ctx.render('tagquestion/new', {
// 			errors: validationError.errors,
// 		    tagquestion,
// 			submitTagquestionPath: ctx.router.url('createTagquestion')
// 		})
// 	}
// })

router.delete('deleteTagquestion', '/tagquestions/:id', async (ctx) => {
	await ctx.orm.tagquestion.destroy({
	    where: { id: ctx.params.id },
	    });
	ctx.redirect(ctx.router.url('tagquestions')); 
})

router.get('tagquestion', '/tagquestions/:id', async (ctx) => {
	const tagquestion = await ctx.orm.tagquestion.findById(ctx.params.id)
	await ctx.render('tagquestions/show', {
		tagquestion
	})
})


router.get('tag', '/:id', async (ctx) => {
	const tag = await ctx.orm.tag.findById(ctx.params.id)
	const tagquestions = await tag.getTagquestions();
	const questionsBuilder = async (tagquestion) => {
		const question = await tagquestion.getQuestion();
	}

	let questions = []
	tagquestions.forEach(tagquestion => {
		questions.push(questionsBuilder(tagquestions))
	})

	await ctx.render('tags/show', {
		questions,
		tag
	})
})

module.exports = router