const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('questions', '/', async (ctx) => {
  const {user} = ctx.state;
  // const questions = ctx.orm.question.find({
  //   where: { userId: user.id },
  // })
  const questions = await user.getQuestions();
  await ctx.render('questions/index', {user, questions});
})

module.exports = router;
