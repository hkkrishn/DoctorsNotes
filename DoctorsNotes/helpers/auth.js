module.exports = {
  ensureAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg','Not Authorized to enter Nexus,Please Log In');
    res.redirect('/users/login')
  }
};