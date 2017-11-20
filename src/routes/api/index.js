const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const questionsRoutes = require('./questions')
const authRoutes = require('./auth')

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authRoutes.routes());

// JWT authentication without passthrough (error if not authenticated)
// router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
// router.use(async (ctx, next) => {
//   if (ctx.state.authData.userId) {
//     ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
//   }
//   return next();
// });

// authenticated endpoints
router.use('/questions', questionsRoutes.routes())

// router.use('/ongs', ongsRoutes.routes());

module.exports = router;
