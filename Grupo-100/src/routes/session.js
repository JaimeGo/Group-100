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
  ctx.assert(user, 401, 'Credenciales inválidas')
  const isPasswordCorrect = await user.checkPassword(password);
  ctx.assert(isPasswordCorrect, 401, 'Credenciales inválidas')
  if (isPasswordCorrect){
    ctx.session.userId = user.id;
    return ctx.redirect(ctx.router.url('allQuestions'));
  }
  return ctx.render('session/new', {
    user,
    createSessionPath: ctx.router.url('createSession'),
    error: 'usuario o contraseña incorrectos'
  })
});

router.delete('destroySession', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('allQuestions'));
})

module.exports = router;
