const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.Question.findAll();
  await ctx.render('questions/index', {questions});
})

router.get('newquestion', '/new', async (ctx) => {
  const question = await ctx.orm.Question.build();
  await ctx.render('questions/new', {
    question,
    createquestionPath: ctx.router.url('createquestion'),
  });
})

router.post('createquestion', '/', async (ctx) => {
  const question = await ctx.orm.Question.create(ctx.request.body);
  ctx.redirect(ctx.router.url('questions'));
})

router.get('editquestion', '/:id/edit', async (ctx) => {
  const question = await ctx.orm.Question.findById(ctx.params.id);
  await ctx.render('questions/edit', {
    question, 
    updatequestionPath: ctx.router.url('updatequestion', question.id),
  })
})

router.patch('updatequestion', '/:id', async (ctx) => {
  const question = await ctx.orm.Question.findById(ctx.params.id);
  await question.update(ctx.request.body);
  ctx.redirect(ctx.router.url('questions'));
})


router.get('question', '/:id', async (ctx) => {
  const question = await ctx.orm.Question.findById(ctx.params.id);
  await ctx.render('questions/show', {
    question,
    deletequestionPath: ctx.router.url('deletequestion', question.id),
  });
})

router.delete('deletequestion', '/:id', async (ctx) => {
  await ctx.orm.Question.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('questions'));  
})

module.exports = router;