const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('newModule', '/:examId/modules/new', async (ctx) => {
	//if (!ctx.state.currentUser.admin) {
	if (true) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);
		const mod = await ctx.orm.exammodule.build();
		console.log("carga_newModule");
		await ctx.render('exams/newModule', {
		mod,
		exam,
		submitModulePath: ctx.router.url('createModule',{examId:ctx.params.examId})
		})
	} else {
		ctx.redirect(ctx.router.url('exams'));	
	}
})

router.post('createModule', '/:examId/modules/create', async (ctx) => {
	try {
		ctx.request.body.examId = ctx.params.examId
		const exam=await ctx.orm.exam.findById(ctx.params.examId);
		const mod = await exam.createExammodule(ctx.request.body);		
		ctx.redirect(ctx.router.url('exams'),
			{id: mod.id});
	} catch (validationError) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);
		const mod = await ctx.orm.exammodule.build();
		await ctx.render('exams/newModule', {
		mod, 
		exam,
		submitModulePath: ctx.router.url('createModule',{examId:ctx.params.examId})
		})
	}
})

router.get('module', '/:examId/modules/:moduleId', async (ctx) => {
	const exam = await ctx.orm.exam.findById(ctx.params.examId);
	const module = await ctx.orm.exammodule.findById(ctx.params.moduleId);
	const examquestions = await ctx.orm.examquestion.findAll({where: {exammoduleId:ctx.params.moduleId}});
	await ctx.render('exams/showModule', {
		exam,
		module,
		examquestions,
	  	newExamQuestionPath:ctx.router.url('newExamQuestion', {examId:ctx.params.examId, moduleId:ctx.params.moduleId})
	})
})

module.exports = router