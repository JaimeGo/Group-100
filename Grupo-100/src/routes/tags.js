const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('tags', '/', async (ctx) => {
  let admin = false;
  if (ctx.state.currentUser && ctx.state.currentUser.admin){
  	admin = true
  } 
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/index', {
    tags,
    tagPathBuilder: (tag) => ctx.router.url('tag', tag.id), 
    admin,
    newTagPath: ctx.router.url('newTag')
     });
})

router.get('newTag', '/new', async (ctx) => {
	if (ctx.state.currentUser){
		if (ctx.state.currentUser.admin){
			const tag = await ctx.orm.tag.build()
			await ctx.render('tags/new', {
	  			tag,
				submitTagPath: ctx.router.url('createTag')
			})
		} else {
			ctx.throw(401, "Usuario no es administrador")
		}
	} else {
		ctx.throw(401, "No se encuentra registrado")
	}
})

router.post('createTag', '/', async (ctx) => {
	try {
		ctx.request.body.active = false
		const tag = await ctx.orm.tag.create(ctx.request.body);
		ctx.redirect(ctx.router.url('tags'))
	} catch (validationError) {
		console.log(validationError.errors)
		const tag = await ctx.orm.tag.build()
		await ctx.render('tags/new', {
			errors: validationError.errors,
		    tag,
			submitTagPath: ctx.router.url('createTag')
		})
	}
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