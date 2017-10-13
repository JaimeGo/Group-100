const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('tags', '/', async (ctx) => {
  const tags = await ctx.orm.tag.findAll();
  await ctx.render('tags/index', {
    tags,
    tagPathBuilder: (tag) => ctx.router.url('tag', tag.id), 
     });
})

module.exports = router