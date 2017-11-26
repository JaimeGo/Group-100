const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.post('upload', 'files/upload/:fileName', async (ctx) => {
  console.log(ctx.request.body);
  console.log(ctx.request.body.files);
  const uploads = ctx.request.body.files.uploads;
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


router.get('download', 'files/download/:fileName', (ctx) => {
    ctx.body = fileStorage.download(ctx.query.file);
    ctx.response.type = 'image/png';
 });

module.exports=router;
