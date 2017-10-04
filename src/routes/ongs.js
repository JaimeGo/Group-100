const KoaRouter = require('koa-router');
const initiativesRouter = require('./initiatives');

const router = new KoaRouter();

router.get('ongs', '/', async (ctx) => {
  const ongs = await ctx.orm.ong.findAll();
  await ctx.render('ongs/index', {
    ongs,
    ongPath: ong => ctx.router.url('ong', { id: ong.id }),
  });
});

router.get('ong', '/:id', async (ctx) => {
  const ong = await ctx.orm.ong.findById(ctx.params.id);
  const initiatives = await ong.getInitiatives({ limit: 3, order: [['createdAt', 'DESC']] });
  await ctx.render('ongs/show', {
    ong,
    initiatives,
    ongInitiativesPath: ctx.router.url('ongInitiatives', ong.id),
  });
});

router.use(
  '/:ongId/initiatives',
  async (ctx, next) => {
    ctx.state.ong = await ctx.orm.ong.findById(ctx.params.ongId);
    await next();
  },
  initiativesRouter.routes(),
);

module.exports = router;
