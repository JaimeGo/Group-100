const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const questions = await ctx.orm.question.findAll();
  ctx.body = {"hola": "cómo te baila, viejo?"}
  // ctx.body = ctx.jsonSerializer('questions', {
  //   attributes: ['title'],
  //   topLevelLinks: {
  //     self: `${ctx.origin}${ctx.router.url('questions')}`,
  //   },
  //   dataLinks: {
  //     self: (dataset, question) => `${ctx.origin}/api/question/${question.id}`,
  //   },
  // }).serialize(questions);
});

module.exports = router;