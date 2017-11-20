const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.post('auth', '/', async (ctx) => {
  console.log("Authentificating!! ")
  console.log("Body: ", ctx.body)
});

module.exports = router;
