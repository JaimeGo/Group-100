const KoaRouter = require('koa-router');

// const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

router.get('hello', '/', async (ctx) => {
  await ctx.render('hello/index', {
    nameUrl: name => ctx.router.url('hello.name', name),
    notice: ctx.flashMessage.notice,
  });
});

router.post('hello', '/', (ctx) => {
  console.log(ctx.request.body);
  ctx.flashMessage.notice = 'Form successfully processed';

  // E3
  // const uploads = ctx.request.body.files.uploads
  // if (Array.isArray(uploads)){

  // }
  //

  ctx.redirect(router.url('hello'));
});

router.get('hello.name', '/:name', (ctx) => {
  ctx.body = { message: `Hello ${ctx.params.name}!` };
});

module.exports = router;
