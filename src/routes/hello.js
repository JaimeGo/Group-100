const KoaRouter = require('koa-router');
const sendExampleEmail = require('../mailers/example');

const router = new KoaRouter();
const fileStorage = require('../services/file-storage');

router.get('hello', '/', async (ctx) => {
  await ctx.render('hello/index', {});
});

router.post('hello', '/', async (ctx) => {
  console.log(ctx.request.body);
  console.log(ctx.request.body.files);
  const uploads = ctx.request.body.files.uploads;
  
  console.log(Array.isArray(uploads));
 
  if (Array.isArray(uploads)) {
  
    uploads.forEach(f => fileStorage.upload(f));
  } else {
    
    await fileStorage.upload(ctx.request.body.files.uploads);
  }
  
  ctx.flashMessage.notice = 'Form successfully processed';
  // this is just to show how to send an e-mail using a mailer helper fn
  // but it will never be executed
  if (Math.random() > 1) {
    await sendExampleEmail(ctx.request.body);
  }
  ctx.redirect(router.url('hello'));
});


router.get('hello.file', '/file', (ctx) => {
    ctx.body = fileStorage.download(ctx.query.file);
    ctx.response.type = 'image/png';
 });


router.get('hello.name', '/:name', (ctx) => {
  ctx.body = { message: `Hello ${ctx.params.name}!` };
});

module.exports = router;
