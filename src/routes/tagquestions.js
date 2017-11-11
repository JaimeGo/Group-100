const KoaRouter = require('koa-router');

const router = new KoaRouter();

// router.get('allQuestions', '/', async (ctx) => {
//   const questions = await ctx.orm.question.findAll();
//   console.log('\n\n\n\nctx.session.searchInfo in allQuestions: ', ctx.session.searchInfo)
//   await ctx.render('questions/indexAll', {
//       questions,
//       questionPathBuilder: question => 
//         ctx.router.url('question', {id: question.id}),
//       order: "Nombre",
//       //
//       tagsInfo: ctx.state.tagsInfo,
//       questionsInfo: ctx.state.questionsInfo,
//       searchInfo: ctx.session.searchInfo,
//       updateActiveTagsPath: ctx.router.url('updateActiveTags'),
//       updateSearchPath: ctx.router.url('updateSearch')
//       //
//   }); 
// })

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

module.exports = router