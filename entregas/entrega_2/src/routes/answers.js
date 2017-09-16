const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('answers', '/', async (ctx) => {
  const answers = await ctx.orm.Answer.findAll();
  await ctx.render('answers/index', {answers});
})

router.get('newanswer', '/new', async (ctx) => {
  const answer = await ctx.orm.Answer.build();
  await ctx.render('answers/new', {
    answer,
    createanswerPath: ctx.router.url('createanswer'),
  });
})

router.post('createanswer', '/', async (ctx) => {
  const answer = await ctx.orm.Answer.create(ctx.request.body);
  ctx.redirect(ctx.router.url('answers'));
})

router.get('editanswer', '/:id/edit', async (ctx) => {
  const answer = await ctx.orm.Answer.findById(ctx.params.id);
  await ctx.render('answers/edit', {
    answer, 
    updateanswerPath: ctx.router.url('updateanswer', answer.id),
  })
})

router.patch('updateanswer', '/:id', async (ctx) => {
  const answer = await ctx.orm.Answer.findById(ctx.params.id);
  await answer.update(ctx.request.body);
  ctx.redirect(ctx.router.url('answers'));
})


router.get('answer', '/:id', async (ctx) => {
  const answer = await ctx.orm.Answer.findById(ctx.params.id);
  await ctx.render('answers/show', {
    answer,
    deleteanswerPath: ctx.router.url('deleteanswer', answer.id),
  });
})

router.delete('deleteanswer', '/:id', async (ctx) => {
  await ctx.orm.Answer.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('answers'));  
})

module.exports = router;