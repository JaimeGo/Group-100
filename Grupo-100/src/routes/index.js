const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async (ctx) => {
	const exams= await ctx.orm.exam.findAll();
	

 	 await ctx.render('index', { appVersion: pkg.version, exams });
});

module.exports = router;
