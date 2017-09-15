const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.User.findAll();
  await ctx.render('users/index', {users});
})

router.get('newUser', '/new', async (ctx) => {
  const user = await ctx.orm.User.build();
  await ctx.render('users/new', {
    user,
    createUserPath: ctx.router.url('createUser'),
  });
})

router.post('createUser', '/', async (ctx) => {
  const user = await ctx.orm.User.create(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
})

router.get('editUser', '/:id/edit', async (ctx) => {
  const user = await ctx.orm.User.findById(ctx.params.id);
  await ctx.render('users/edit', {
    user, 
    updateUserPath: ctx.router.url('updateUser', user.id),
  })
})

router.patch('updateUser', '/:id', async (ctx) => {
  const user = await ctx.orm.User.findById(ctx.params.id);
  await user.update(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
})


router.get('user', '/:id', async (ctx) => {
  const user = await ctx.orm.User.findById(ctx.params.id);
  await ctx.render('users/show', {
    user,
    deleteUserPath: ctx.router.url('deleteUser', user.id),
  });
})

router.delete('deleteUser', '/:id', async (ctx) => {
  await ctx.orm.User.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('users'));  
})

module.exports = router;