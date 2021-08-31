import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../api/arbres.js';
import { Accounts } from 'meteor/accounts-base';

import '../../client/lib/routes.js'
import '../templates/app.html';
import '../templates/loginBtn.html';
import '../templates/loginPage.html';
import '../templates/registerPage.html';
import '../templates/disconnectHeader.html';

Template.loginBtn.events({
	//quand on clique sur "se connecter", on charge la page de connexion
    'click #loginButton': function(event){
		FlowRouter.go('loginPage', {typeUsLog: "user"});
	},
	//quand on clique sur "créer un compte, on se créer un compte"
    'click #registerButton': function(event){
		FlowRouter.go('registerPage', {typeUsReg: "free"});
	},
	'click #registerButtonPremium': function(event){
		FlowRouter.go('registerPage', {typeUsReg: "paying"});
	}
});

Template.registerPage.events({
	'click #boutonReg': function(event){
		console.log("I've been pressed !")
		event.preventDefault();

		//récupération des infos des inputs
		let nomFam = document.getElementById("surnameReg").value;
		let prenomUt = document.getElementById("nameReg").value;
		let emailAdrs = document.getElementById("emailReg").value;
		let motDePasse = document.getElementById("passwordReg").value;
		let motDePasseConfirmation = document.getElementById("passwordRegConf").value;

		//variables pour des tests plus tard
		let re = /\S+@\S+\.\S+/;
		let i = 1;
		let id;
		let codeT = "";
		
		//établissement automatique d'un pseudo qui transforme "John Smith" en "johnsmith"
		let pseudo = ""
		pseudo += prenomUt.toLowerCase();
		pseudo += nomFam.toLowerCase();
		let pseudoOriginal = pseudo;

		//le premier utilisateur créé est admin
        let monAdmin = false;
        if(Meteor.users.find().count()<1){
            monAdmin = true;
        }

		if(FlowRouter.getParam("typeUsReg")!="free" && FlowRouter.getParam("typeUsReg")!="paying"){
			codeT=FlowRouter.getParam("typeUsReg");
		}

		//si les deux mots de passes ne sont pas les mêmes
		if(motDePasse!=motDePasseConfirmation){
			alert(motDePasse + "Les mots de passes ne sont pas les mêmes !");
		}

		//si l'adress email est invalide
		if(!emailAdrs.match(re)){
			alert("Votre email n'est pas valide !");
		}

		//s'il manque le nom/prénom
		if(!prenomUt || !nomFam){
			alert("Veuillez entrer un nom/prénom !");
		}
		else{
			//modifier le pseudo de l'utilisateur si un autre utilisateur a le même 
			//--> transforme "jsmith" en "johnsmith1" si le premier existe, "johnsmith1" en "johnsmith2" si "johnsmith1" existe, etc
			if(Meteor.users.findOne({username: pseudo})){
				while(Meteor.users.findOne({username: pseudo})){
					pseudo = pseudoOriginal + i
					i++;
				}
			}
			id = Accounts.createUser({
				username: pseudo,
				email: emailAdrs,
				password: motDePasse,
				profile: {
					isAdmin: monAdmin,
					userTier: 0,
					trees: [codeT]
				}
			}, function(error){
				if(error){
					alert(error.reason);
				}
				else{
					TreeCollection.update({_id: TreeCollection.findOne({codeArbre: FlowRouter.getParam("typeUsReg")})._id}, {$set: {nomUtilisateur: pseudo}});
					FlowRouter.go("home");
				}
			});
		}
	},
	'click #annulerReg': function(event){
		event.preventDefault();
		console.log("annuler")
		FlowRouter.go('home', { _id: Meteor.userId() });
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
				if(FlowRouter.getParam("typeUsLog")!="user"){
					Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": FlowRouter.getParam("typeUsLog")}});
					TreeCollection.update({_id: TreeCollection.findOne({codeArbre: FlowRouter.getParam("typeUsLog")})._id}, {$set: {nomUtilisateur: Meteor.users.findOne({_id: Meteor.userId()}).username}});
				}
				FlowRouter.go('home');
			}
		})
	},
	'click #annulerLogin': function(event){
		event.preventDefault();
		FlowRouter.go('home');
	}
});

Template.disconnectHeader.events({
	'click #disconnectUser': function(event){
		event.preventDefault();
		Meteor.logout();
	}
});