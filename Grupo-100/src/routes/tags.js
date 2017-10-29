const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('tags', '/', async (ctx) => {
  console.log(ctx.request.body)
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

// router.get('selectTags', 'selectTags', async (ctx) => {
//   const question = await ctx.orm.question.findById(ctx.params.id)
//   const tags = await ctx.orm.tag.findAll();
//   const tags_ids = tags.map((i) => i.id)
// //
//   const tagquestions = await question.getTagquestions();
//   const tags_associated = []
//   const tags_no_associated = []
//   const add = async (tq) => {
//     const t = await ctx.orm.tag.findById(tq.tagId)
//     tags_associated.push(t)
//   }
//   for (let j = 0; j < tagquestions.length; j++){
//     await add(tagquestions[j])
//   }

//   const tags_associated_ids = tags_associated.map((i) => i.id)

//   for (let k = 0; k < tags_ids.length; k++){
//     console.log("index: ", tags_ids)
//     if (tags_associated_ids.indexOf(tags_ids[k]) < 0){
//       tags_no_associated.push(tags[k])
//     }
//   }

// //

//   await ctx.render('tags/select', {
//     tags,
//     tags_no_associated,
//     question,
//     createTagquestionPathBuilder: tag => 
//       ctx.router.url('createTagquestion', {
//         id: ctx.params.id,
//         tagId: tag.id
//       })
//   });
// })  

// router.post('createTagquestion', '/:id/tagquestions/:tagId', async (ctx) => {
//   const question = await ctx.orm.question.findById(ctx.params.id)
//   const tag = await ctx.orm.tag.findById(ctx.params.tagId)
//   const user = await ctx.state.currentUser
//   ctx.assert(question, 404, 'No hay pregunta', {id: ctx.params.questionId})
//   ctx.assert(tag, 404, 'No hay tag', {id: ctx.params.id})
//   ctx.assert(user, 401, 'No hay sesión iniciada')
//   const tagquestion = await ctx.orm.tagquestion.create({userId: user.id});
//   tagquestion.setQuestion(question)
//   tagquestion.setTag(tag)
//   ctx.redirect(ctx.router.url('question', {id: ctx.params.id}))
// })

// router.delete('deleteTagquestion', '/:id/tagquestions/:tagId', async (ctx) => {
//   await ctx.orm.tagquestion.destroy({
//       where: { 
//         tagId: ctx.params.tagId,
//         questionId: ctx.params.id,
//        }
//       });
//   ctx.redirect(ctx.router.url('question', ctx.params.id)); 
// })


// routes.get('tagsOnQuestions', '/', async (ctx) => {
// 	ctx.redirect('tags')
// }) 

module.exports = router