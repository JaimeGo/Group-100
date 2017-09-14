const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.User.findAll();
  await ctx.render('users/index', {users});
}
  )

module.exports = router;