const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

process.env.JWT_SECRET = "string"

router.post('auth', '/', async (ctx) => {
  console.log("Authentificating!! ")
  console.log("ctx.request.body: ", ctx.request.body)
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
    console.log("after promise of token")
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Wrong e-mail or password');
  }
});

module.exports = router;
