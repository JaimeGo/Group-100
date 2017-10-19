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


// tagquestions:

router.get('selectTags', '/questions/:questionId/selectTags', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.questionId)
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/select', {
    tags,
    question,
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

router.get('newTagquestion', '/:id/questions/:questionId/tagquestions/new', async (ctx) => {
	const tagquestion = await ctx.orm.tagquestion.build({
		questionId: ctx.params.questionId,
		tagId: ctx.params.id,
	})
	await ctx.render('tagquestions/new', {
	    tagquestion,
	    tagId: ctx.params.id,
	    questionId: ctx.params.questionId,
		submitTagquestionPathBuilder: (tagId, questionId) => 
			ctx.router.url('createTagquestion', {
				id: tagId,
				questionId
			})
	})
})

router.post('createTagquestion', '/:id/questions/:questionId/tagquestions', async (ctx) => {
	const question = await ctx.orm.question.findById(ctx.params.questionId)
	const tag = await ctx.orm.tag.findById(ctx.params.id)
	ctx.assert(question, 404, 'No hay pregunta', {id: ctx.params.questionId})
	ctx.assert(tag, 404, 'No hay tag', {id: ctx.params.id})
	const tagquestion = await ctx.orm.tagquestion.create();
	tagquestion.setQuestion(question)
	tagquestion.setTag(tag)
	ctx.redirect(ctx.router.url('tagquestions'))
})

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
	ctx.assert(tag, 404, `No existe la tag pedida`, {id: ctx.params.id})
	const tagquestions = await tag.getTagquestions();
	const questions = []
	const add = async (tq) => {
		const q = await ctx.orm.question.findById(tq.questionId)
		questions.push(q)
	}
	for (let j = 0; j < tagquestions.length; j++){
		await add(tagquestions[j])
	}

	await ctx.render('tags/show', {
		questions,
		tag,
		tagquestions
	})
})

module.exports = router