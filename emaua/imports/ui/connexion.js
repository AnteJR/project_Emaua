import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../api/arbres.js';

import '../templates/app.html';
import '../templates/loginBtn.html';

Template.loginBtn.events({
    'click .loginButton': function(event){
		FlowRouter.go('loginPage');
	},
    'click .registerButton': function(event){
		FlowRouter.go('registerPage');
	},
})