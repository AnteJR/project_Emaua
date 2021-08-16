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
FlowRouter.route('/trees', {
    name: 'addTreeForm',
    action(){
        BlazeLayout.render('addTreeForm');
    }
});
FlowRouter.route('/treesCode/:codeArbre', {
    name: 'addTreeCode',
    action(){
        BlazeLayout.render('addTreeCode');
    }
});