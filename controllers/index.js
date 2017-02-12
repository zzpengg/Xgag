
var multipart = require('connect-multiparty');
var users     = require('./users');
var root      = require('./root');
var posts     = require('./posts');
var news      = require('./news');

module.exports = function(app , passport) {

  app.use ('/'               , root);
  app.get ('/logout'         , users.logout);
  app.get ('/users'          , users.overview);
  app.get ('/detailPost/:id' , posts.detailPost);
  app.post('/upload'         , multipart(), users.upload);
  app.get ('/getPosts'       , posts.getPosts);
  app.get ('/getComments/:id', posts.getComment);
  app.get ('/like/add/:id'   , posts.addLike);
  app.get ('/dislike/add/:id', posts.addDislike);
  app.post ('/comment/add/:id', posts.addComment);
  app.get ('/news/urlPreview', news.urlPreview);

  /*
   *google
   */
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  app.get('/auth/google/callback',passport.authenticate('google', {
    successRedirect : '/log-success',
    failureRedirect : '/'
  }));
  /*
   *facebook
   */
  app.get('/auth/facebook', passport.authenticate('facebook', { scope :'email' }));
  app.get('/auth/facebook/callback',passport.authenticate('facebook', {
    successRedirect : '/log-success',
    failureRedirect : '/'
  }));
  app.get('/log-success'     ,isLoggedIn,function(req, res){
    console.log(req.user);
    req.session.user = req.user.user;
    res.redirect('/');
  });

  return function(req, res, next) {
      return next();
  };

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
