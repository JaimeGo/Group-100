const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('newExamQuestion', '/:examId/modules/:moduleId/examquestions/new', async (ctx) => {
	if (true) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);
		const mod = await ctx.orm.exammodule.findById(ctx.params.moduleId);
		const question = await ctx.orm.examquestion.build();
		await ctx.render('exams/newExamQuestion', {
		mod,
		exam,
		question,
		submitExamQuestionPath: ctx.router.url('createExamQuestion',{
			examId:ctx.params.examId, 
			moduleId: ctx.params.moduleId
		})
		})
	} else {
		ctx.redirect(ctx.router.url('exams'));	
	}
})

router.post('createExamQuestion', '/:examId/modules/:moduleId/examquestions/create', async (ctx) => {
	try {
		console.log("Exito1");
		const mod=await ctx.orm.exammodule.findById(ctx.params.moduleId);
		console.log("Exito2", mod);
		const question = await mod.createExamquestion(ctx.request.body);	
		ctx.redirect(ctx.router.url('exams'),
			{id: mod.id});
		console.log("Exito3");
	} catch (validationError) {
		const exam = await ctx.orm.exam.findById(ctx.params.examId);
		const module = await ctx.orm.exammodule.findById(ctx.params.moduleId);
		const question = await ctx.orm.examquestion.build();
		await ctx.render('exams/newExamQuestion', {
			module,
			exam,
			question,
		  	submitExamQuestionPath: ctx.router.url('createExamQuestion',{examId:ctx.params.examId, moduleId:ctx.params.moduleId})
		})
	}
})

router.get('examquestion', '/:examId/modules/:moduleId/examquestions/:examQuestionId', async (ctx) => {
	const exam = await ctx.orm.exam.findById(ctx.params.examId);
	const module = await ctx.orm.exammodule.findById(ctx.params.moduleId);
	const question = await ctx.orm.examquestion.findById(ctx.params.examQuestionId);
	const answers = await ctx.orm.examanswer.findAll({where:
		{examquestionId: ctx.params.examQuestionId}});
	await ctx.render('exams/showExamQuestion', {
		exam,
		module,
		question,
		answers,
	  	newExamAnswerPath:ctx.router.url('newExamAnswer', {
	  		examId: ctx.params.examId, 
	  		moduleId: ctx.params.moduleId, 
	  		examQuestionId: ctx.params.examQuestionId
	  	})
	})
})


module.exports = router