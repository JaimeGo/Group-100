const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('votes', '/', async (ctx) => {
  console.log("\n\n\n\nindex de votes!!!!!!!!")
  const votes = await ctx.orm.vote.findAll();
  console.log("\n\n\n\ndespues de vote.findAll!!!!!!!!")
  await ctx.render('votes/index', {
  	votes,
  });
})

module.exports = router;
