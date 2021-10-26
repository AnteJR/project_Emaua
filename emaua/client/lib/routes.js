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
        BlazeLayout.render('addTreeCode');
    }
});
FlowRouter.route('/password', {
    name: 'newPassword',
    action(){
        BlazeLayout.render('changePassword');
    }
});
FlowRouter.route('/reset-password/:monToken', {
    name: 'forgotPW',
    action(){
        BlazeLayout.render('forgotPassword');
    }
});
FlowRouter.route('/myProject/:codeArbre', {
    name: 'project',
    action(){
        BlazeLayout.render('treeMaps');
    }
});
FlowRouter.route('/updateProject', {
    name: 'updateProj',
    action(){
        BlazeLayout.render('addUpdateForm');
    }
});