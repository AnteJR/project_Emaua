FlowRouter.route('/', {
    name: 'home',
    action(){
        BlazeLayout.render('mainPage');
    }
});
FlowRouter.route('/login', {
    name: 'loginPage',
    action(){
        BlazeLayout.render('loginPage');
    }
});
FlowRouter.route('/register', {
    name: 'registerPage',
    action(){
        BlazeLayout.render('registerPage');
    }
});