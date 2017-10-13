const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('comments', '/', async (ctx) => {
  const comments = await ctx.orm.comment.findAll();
  await ctx.render('comments/index', {comments});
})

router.get('newcomment', '/new', async (ctx) => {
  const comment = await ctx.orm.comment.build();
  await ctx.render('comments/new', {
    comment,
    createcommentPath: ctx.router.url('createcomment'),
  });
})

router.post('createcomment', '/', async (ctx) => {
  const comment = await ctx.orm.comment.create(ctx.request.body);
  ctx.redirect(ctx.router.url('comments'));
})

router.get('editcomment', '/:id/edit', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
  await ctx.render('comments/edit', {
    comment, 
    updatecommentPath: ctx.router.url('updatecomment', comment.id),
  })
})

router.patch('updatecomment', '/:id', async (ctx) => {
  const comment = await ctx.orm.comment.findById(ctx.params.id);
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

router.delete('deletecomment', '/:id', async (ctx) => {
  await ctx.orm.comment.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('comments'));  
})

module.exports = router;