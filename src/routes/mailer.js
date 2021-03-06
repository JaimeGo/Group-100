
const KoaRouter = require('koa-router');
const router = new KoaRouter();
const myMailer = require ('../services/mailer');


router.get('newMail', '/new', async (ctx) => {
    const users = await ctx.orm.user.findAll();
    var title, body;
    await ctx.render('mailer/new', {
        submitMailPath:ctx.router.url('createMail', {}),
        title,
        body,
    }); 
})



router.post('createMail', '/create', async (ctx) => {
    console.log(ctx.params);

    const users = await ctx.orm.user.findAll();
    
    const route=ctx.router.url('newMail');

  

    myMailer(ctx.request.body.title,ctx.request.body.body,users,route, ctx);


    

})

module.exports = router;
