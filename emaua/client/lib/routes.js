FlowRouter.route('/', {
    name: 'home',
    action(){
        BlazeLayout.render('mainPage');
    }
});
FlowRouter.route('/login/:typeUsLog', {
    name: 'loginPage',
    action(){
        BlazeLayout.render('loginPage');
    }
});
FlowRouter.route('/register/:typeUsReg', {
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
        BlazeLayout.render('addTreesCode');
    }
});
FlowRouter.route('/plans', {
    name: 'plans',
    action(){
        BlazeLayout.render('registerPage');
    }
});