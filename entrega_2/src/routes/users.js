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

module.exports = router;