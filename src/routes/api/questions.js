const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.question.findAll();
  ctx.body = ctx.jsonSerializer('questions', {
    attributes: ['title', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('questions')}`,
    },
    dataLinks: {
      self: (dataset, question) => `${ctx.origin}/api/questions/${question.id}`,
    },
  }).serialize(questions);
});

router.post('createQuestion', '/', async (ctx) => {
  try {
    await ctx.state.currentUser.createQuestion(ctx.request.body.fields)
  } catch (validationError) {
    ctx.throw(404, 'Wrong parameters or values');
  }
})

router.patch('updateQuestion', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!ctx.state.currentUserAdmin && 
    ctx.state.currentUserId != question.userId) {
    ctx.throw(401, "You don't have permissions on this resource")
    return
  } 
  try {
    await question.update(ctx.request.body.fields)
  } catch (validationError) {
    ctx.throw(404, 'Wrong parameters or values');
  }
})

router.delete('deleteQuestion', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id);
  if (!ctx.state.currentUserAdmin && 
    ctx.state.currentUserId != question.userId) {
    ctx.throw(401, "You don't have permissions on this resource")
    return
  }   
  try {
      await ctx.orm.question.destroy({
        where: { id: ctx.params.id },
      });
      await ctx.orm.report.destroy({
        where: {questionId: ctx.params.id}
      })
  } catch (validationError) {
    ctx.throw(404, 'Wrong parameters or values');
  }
})

router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.question.findById(ctx.params.id)
  ctx.body = ctx.jsonSerializer('question', {
    attributes: ['title', 'body', 'updatedAt', 'createdAt', 'userId']
  }).serialize(question)
})

module.exports = router;