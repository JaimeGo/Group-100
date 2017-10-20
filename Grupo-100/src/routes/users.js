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
    submitUserPath: ctx.router.url('createUser'),
    usersPath: ctx.router.url('users')
  });
})

router.post('createUser', '/', async (ctx) => {
  ctx.request.body.admin = false;
  const user = await ctx.orm.user.build(ctx.request.body);
  try {
    // const user = await ctx.orm.user.create(body);

    //IT DOESN'T WORK
    // await user.save({fields: {
    //   'name': body.name, 
    //   'password': body.password,
    //   'admin': true}})

    await user.save({fields: ['name', 'password', 'admin']})
    ctx.redirect(ctx.router.url('users'));
  } catch (validationError) {
    await ctx.render('users/new', {
      // user: await ctx.orm.user.build(body),
      user,
      submitUserPath: ctx.router.url('createUser'), 
      errors: validationError.errors,
      usersPath: ctx.router.url('users')   
    })
  }
})

router.get('editUser', '/:id/edit', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await ctx.render('users/edit', {
    user, 
    submitUserPath: ctx.router.url('updateUser', user.id),
    usersPath: ctx.router.url('users'),
  })
})

router.patch('updateUser', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  try {
    await user.update(ctx.request.body);
    ctx.redirect(ctx.router.url('users'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user, 
      submitUserPath: ctx.router.url('updateUser', user.id),
      errors: validationError.errors,
      usersPath: ctx.router.url('users'),   
    })    
  }
  // const user = await ctx.orm.user.findById(ctx.params.id);
  // await user.update(ctx.request.body);
  // ctx.redirect(ctx.router.url('users'));
})


router.get('user', '/:id', async (ctx) => {
  // try{
  //   const user = await ctx.orm.user.findById(ctx.params.id);
  //   await ctx.render('users/show', {
  //     user,
  //     deleteUserPath: ctx.router.url('deleteUser', user.id),
  //     editUserPath: ctx.router.url('editUser', user.id),
  //     usersPath: ctx.router.url('users'),
  //     questionsPath: ctx.router.url('questions', 
  //     {userId: user.id, sort: 'default'})
  //   })
  // }catch (TypeError){
  //   const users = await ctx.orm.user.findAll();
  //   await ctx.render('users/index', {
  //     users,
  //     userPathBuilder: (user) => ctx.router.url('user', user.id), 
  //     newUserPath: ctx.router.url('newUser'),
  //     errors: [{message: "El usuario señalado no existe"}]
  //      });
  // }

    const user = await ctx.orm.user.findById(ctx.params.id);
    ctx.assert(user, 404, 'El usuario señalado no existe', {id: ctx.params.id})
    await ctx.render('users/show', {
      user,
      deleteUserPath: ctx.router.url('deleteUser', user.id),
      editUserPath: ctx.router.url('editUser', user.id),
      usersPath: ctx.router.url('users'),
      questionsPath: ctx.router.url('questions', 
      {userId: user.id, sort: 'default'})
    })

  // const user = await ctx.orm.user.findById(ctx.params.id);
  // await ctx.render('users/show', {
  //   user,
  //   deleteUserPath: ctx.router.url('deleteUser', user.id),
  //   editUserPath: ctx.router.url('editUser', user.id),
  //   usersPath: ctx.router.url('users'),
  //   questionsPath: ctx.router.url('questions', user.id)
  // });
})

router.delete('deleteUser', '/:id', async (ctx) => {
  await ctx.orm.user.destroy({
    where: { id: ctx.params.id },
    limit: 1,
  });
  ctx.redirect(ctx.router.url('users'));  
})

// router.use(
//   '/:userId/questions',
//   async (ctx, next) => {
//     ctx.state.user = await ctx.orm.user.findById(ctx.params.userId);
//     await next();
//   },
//   questionsRouter.routes(),
// );

// router.use(
//   '/:userId/questions',
//   // async (ctx, next) => {
//   //   ctx.state.user = await ctx.orm.user.findById(ctx.params.userId);
//   //   await next();
//   //   ctx.state.user = await ctx.orm.user.findById(ctx.params.userId);
//   // },
//   questionsRouter.routes(),
// );


module.exports = router;