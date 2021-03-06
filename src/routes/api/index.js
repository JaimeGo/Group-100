const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const questionsRoutes = require('./questions')
const authRoutes = require('./auth')

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authRoutes.routes());

console.log("after use auth")
// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
    ctx.state.currentUserId = ctx.state.authData.userId,
    ctx.state.currentUserAdmin = ctx.state.currentUser.admin
  }
  return next();
});

// authenticated endpoints
router.use('/questions', questionsRoutes.routes())

module.exports = router;
