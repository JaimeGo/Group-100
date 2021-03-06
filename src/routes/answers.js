const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('answers', '/', async (ctx) => {  
  const answers = await ctx.orm.answer.findAll();
  await ctx.render('answers/index', {    
    answers,
    answerPathBuilder:answer=>
      ctx.router.url('answer',{
        id:answer.id}),
      order: "Nombre"
  });
})

router.get('newAnswer', '/new', async (ctx) => {
  ctx.assert(ctx.state.currentUser, 401, 'No se ha iniciado sesión')
  const answer = await ctx.orm.answer.build();
  await ctx.render('answers/new', {
    answer,
    submitAnswerPath: ctx.router.url('createAnswer', {
      questionId: ctx.params.questionId
    }),
    answersPath: ctx.router.url('answers',{
      questionId: ctx.params.questionId
    }),
    questionId: ctx.params.questionId
  }
  );
})

router.post('createAnswer', '/', async (ctx) => {
  try {
    const answer = await user.createQuestion(ctx.request.body);
    ctx.redirect(ctx.router.url('answers', {
      questionId: ctx.params.questionId
    }));
  } catch (validationError) {
    await ctx.render('answers/new',{
      errors: validationError.errors,
      answer: ctx.orm.answer.build(ctx.request.body),
      submitAnswerPath: ctx.router.url('createAnswer', {
        questionId: ctx.params.questionId
      }),
      answersPath: ctx.router.url('answers',{
        questionId: ctx.params.questionId
      }),
      questionId: ctx.params.questionId
    })
  }
})

router.get('editAnswer', '/:id/edit', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await ctx.render('answers/edit', {
    user,
    answer, 
    submitAnswerPath: ctx.router.url('updateAnswer', {userId:answer.userId, id:answer.id}),
    answersPath:ctx.router.url('answers',{userId:user.id})
  })
})

router.patch('updateAnswer', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await answer.update(ctx.request.body);
  ctx.redirect(ctx.router.url('answers'));
  try {
      await answer.update(ctx.request.body);
    ctx.redirect(ctx.router.url('answers', {userId: user.id}));
  } catch (validationError) {
    await ctx.render('answers/edit', {
      user,
      answer,
      submitAnswerPath: ctx.router.url('updateAnswer',
        {userId: answer.userId, id: answer.id}),
        errors: validationError.errors,
      answersPath: ctx.router.url('answers', 
        {userId: user.id})      
    })
  }
})

router.patch('updateQuestion', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const question = await ctx.orm.question.findById(ctx.params.id);
  try {
      await question.update(ctx.request.body);
    ctx.redirect(ctx.router.url('questions', {userId: user.id}));
  } catch (validationError) {
    await ctx.render('questions/edit', {
      user,
      question,
      submitQuestionPath: ctx.router.url('updateQuestion',
        {userId: question.userId, id: question.id}),
        errors: validationError.errors,
      questionsPath: ctx.router.url('questions', 
        {userId: user.id})      
    })
  }
})

router.get('answer', '/:id', async (ctx) => {
  const {user} = ctx.state;
  const answer = await ctx.orm.answer.findById(ctx.params.id);
  await ctx.render('answers/show', {
    user,
    answer,
    deleteAnswerPath: ctx.router.url('deleteAnswer', {userId:question.userId,id:question.id}),
    editAnswerPath: ctx.router.url('editAnswer',{userId:question.userId,id:question.id}),
    answersPath: ctx.router.url('answers',{userId:question.userId})
  })
})

router.delete('deleteAnswer', '/:id', async (ctx) => {
  const {user}=ctx.state;
  const question=await ctx.orm.answer.findById(ctx.params.id);
  await ctx.orm.answer.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('answers',{userId:user.id}));  
})

module.exports = router;