const KoaRouter = require('koa-router');
const questionsRouter = require('./questions');

const router = new KoaRouter();

router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    users,
    userPathBuilder: (user) => ctx.router.url('user', user.id), 
    newUserPath: ctx.router.url('newUser')
     });
})

router.get('newUser', '/new', async (ctx) => {
  const user = await ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    createUserPath: ctx.router.url('createUser'),
  });
})

router.post('createUser', '/', async (ctx) => {
  const user = await ctx.orm.user.create(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
})

router.get('editUser', '/:id/edit', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await ctx.render('users/edit', {
    user, 
    updateUserPath: ctx.router.url('updateUser', user.id),
  })
})

router.patch('updateUser', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await user.update(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
})


router.get('user', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await ctx.render('users/show', {
    user,
    deleteUserPath: ctx.router.url('deleteUser', user.id),
    editUserPath: ctx.router.url('editUser', user.id),
    usersPath: ctx.router.url('users'),
  });
})

router.delete('deleteUser', '/:id', async (ctx) => {
  await ctx.orm.user.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('users'));  
})

router.use(
  '/:userId/questions',
  async (ctx, next) => {
    ctx.state.user = await ctx.orm.user.findById(ctx.params.userId);
    await next();
  },
  questionsRouter.routes(),
);


module.exports = router;