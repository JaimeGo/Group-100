const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('theindex','/', async (ctx) => {
	const exams= await ctx.orm.exam.findAll();
	const questions= await ctx.orm.question.findAll();
 	await ctx.render('index', { appVersion: pkg.version, exams, questions });
});

module.exports = router;
