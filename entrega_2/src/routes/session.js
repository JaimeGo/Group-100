const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('newSession', '/new', async ctx =>
  ctx.render('session/new', {
    createSessionPath: ctx.router.url('createSession'),
    notice: ctx.flashMessage.notice,
  }),
);

router.put('createSession', '/', async (ctx) => {
  const {name, password} = ctx.request.body;
  const user = await ctx.orm.user.find({where: {name}});
  // const isPasswordCorrect = await user.checkPassword(password);
  const isPasswordCorrect = (password == user.password);
  if (isPasswordCorrect){
    ctx.session.userId = user.id;
    return ctx.redirect(ctx.router.url('users'));
  }
  return ctx.render('session/new', {
    user,
    createSessionPath: ctx.router.url('createSession'),
    error: 'usuario o contraseña incorrectos'
  })
});

router.delete('destroySession', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('newSession'));
})

module.exports = router;
