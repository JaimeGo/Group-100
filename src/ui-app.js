const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const koaFlashMessage = require('koa-flash-message').default;
const koaStatic = require('koa-static');
const render = require('koa-ejs');
const session = require('koa-session');
const override = require('koa-override-method');
const mailer = require('./mailers');
const routes = require('./routes');
const orm = require('./models');

// E4
require('dotenv').config()

// App constructor
const app = new Koa();

const developmentMode = app.env === 'development';

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  'saying he is logged in when it\'s really not',
];

// expose ORM through context's prototype
app.context.orm = orm;

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// log requests
app.use(koaLogger());

// webpack middleware for dev mode only
if (developmentMode) {
  /* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
  app.use(require('koa-webpack')({ // eslint-disable-line global-require
    dev: {
      index: 'index.html',
      stats: {
        colors: true,
      },
    },
    hot: false,
  }));
}

app.use(koaStatic(path.join(__dirname, '..', 'build'), {}));

// expose a session hash to store information across requests from same client
app.use(session({
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
}, app));

// flash messages support
app.use(koaFlashMessage);

// parse request body
app.use(koaBody({
  multipart: true,
  keepExtensions: true,
}));

app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body);
  return next();
});

// Configure EJS views
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html.ejs',
  cache: !developmentMode,
});

mailer(app);

// Handling errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log("\n\n\n\nCATCHING ERROR WHOSE MESSAGE IS: ", error.message)
    if (error.name === 'NotFoundError'){
      await ctx.render('error', {
        title: error.message,
        details: `El recurso cuya id es ${error.id} no fue encontrado`
      })     
    }
    // login
    else if (error.status == 401){
      await ctx.render('error', {
        title: error.message,
        details: ''
      }) 
    // ctx.app.emit('error', error, ctx)
    } else {
      throw error
    }
  }
})
// 


// Routing middleware
app.use(routes.routes());


app.on('error', (error, ctx) => {
  const logEnabled = false;
  if (logEnabled) {
    console.error(error, ctx);
  }
});


module.exports = app;
