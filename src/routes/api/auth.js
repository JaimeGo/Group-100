const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.post('auth', '/', async (ctx) => {
  const { name, password } = ctx.request.body.fields;
  const user = await ctx.orm.user.find({ where: { name } });
  // if (user && await user.checkPassword(password)) {
  if (user && user.password == password) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Wrong name or password');
  }
});

module.exports = router;
