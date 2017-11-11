const KoaRouter = require('koa-router');

const router = new KoaRouter();

// router.get('votes', '/', async (ctx) => {
//   console.log("\n\n\n\nindex de votes!!!!!!!!")
//   const votes = await ctx.orm.vote.findAll();
//   console.log("\n\n\n\ndespues de vote.findAll!!!!!!!!")
//   await ctx.render('votes/index', {
//   	votes,
//   });
// })

router.patch('upvoteExam', '/upvoteExam/:id', async (ctx) => {
	ctx.assert(ctx.state.currentUser, 401, "No ha iniciado sesión")
	const exam = await ctx.orm.exam.findById(ctx.params.id);
	let params = {
		examId: ctx.params.id, 
		userId: ctx.state.currentUser.id,
		isUpvote: true,
	}
	const existingVote = await ctx.orm.vote.find({where: params})
	console.log("existe voto?: ", !!existingVote)
	ctx.assert(!existingVote, 401, "No puede votar dos veces")
	params.isUpvote = false
	const existingDownvote = await ctx.orm.vote.find({where: params})
	if (existingDownvote){
		await ctx.orm.vote.destroy({where: params})
	} else {
	    params.isUpvote = true
	    const newVote = await ctx.orm.vote.create(params)
	}
	await exam.update({votes_sum: exam.votes_sum + 1})
	ctx.redirect(ctx.router.url('exams'));
})

router.patch('downvoteExam', '/downvoteExam/:id', async (ctx) => {
	ctx.assert(ctx.state.currentUser, 401, "No ha iniciado sesión")
	const exam = await ctx.orm.exam.findById(ctx.params.id);
	let params = {
		examId: ctx.params.id, 
		userId: ctx.state.currentUser.id,
		isUpvote: false
	}
	const existingVote = await ctx.orm.vote.find({where: params})
	ctx.assert(!existingVote, 401, "No puede votar dos veces")
	params.isUpvote = true
	const existingUpvote = await ctx.orm.vote.find({where: params})
	if (existingUpvote){
		await ctx.orm.vote.destroy({where: params})
	} else {
		params.isUpvote = false
		const newVote = await ctx.orm.vote.create(params)
	}
	await exam.update({votes_sum: exam.votes_sum - 1})
	ctx.redirect(ctx.router.url('exams'));
})

module.exports = router;
