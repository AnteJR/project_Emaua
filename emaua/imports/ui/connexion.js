import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../api/arbres.js';
import { Accounts } from 'meteor/accounts-base';

import '../templates/app.html';
import '../templates/loginBtn.html';
import '../templates/loginPage.html';
import '../templates/registerPage.html';

Template.loginBtn.events({
    'click #loginButton': function(event){
		FlowRouter.go('loginPage');
	},
    'click #registerButton': function(event){
		FlowRouter.go('registerPage');
	},
});

Template.registerPage.events({
	'click #boutonReg': function(event){
		console.log("I've been pressed !")
		event.preventDefault();
		let prenomUt = document.getElementById("surnameReg").value;
		let nomFam = document.getElementById("nameReg").value;
		let emailAdrs = document.getElementById("emailReg").value;
		let motDePasse = document.getElementById("passwordReg").value;
		let motDePasseConfirmation = document.getElementById("passwordRegConf").value;
		let re = /\S+@\S+\.\S+/;
		
		if(motDePasse!=motDePasseConfirmation){
			alert("Les mots de passes ne sont pas les mêmes !");
		}
		else if(!emailAdrs.match(re)){
			alert("Votre email n'est pas valide !");
		}
		else if(!prenomUt || !nomFam){
			alert("Veuillez entrer un nom/prénom !");
		}
		else{
			Accounts.createUser({
				prenom: prenomUt,
				nom: nomFam,
				email: emailAdrs,
				mdp: motDePasse
			}, function(error){
				if(error || !emailUt.match(re) || !nomDUt){
					alert(error.reason);
				}
				else{
					FlowRouter.go('home');
					alert("Vous avez créé votre compte !");
				}
			});
		}
	},
	'click #annulerReg': function(event){
		event.preventDefault();
		console.log("annuler")
		FlowRouter.go('home');
	}
})

Template.loginPage.events({
	'click #boutonLogin': function(event){
		event.preventDefault();
		let nomUt = document.getElementById("usernameLogin").value;
		let mdpUt = document.getElementById("passwordLogin").value;

		Meteor.loginWithPassword(nomUt, mdpUt, function(error){
			if(error){
				alert(error.reason);
			}
			else{
				FlowRouter.go('home');
			}
		})
	},
	'click #annulerLogin': function(event){
		event.preventDefault();
		FlowRouter.go('home');
	}
})