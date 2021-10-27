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
import '../templates/changePassword.html';
import '../templates/forgotPassword.html';

//vérifier l'email du user
if(Meteor.isClient){
	Accounts.onEmailVerificationLink((token, done) => {
	  Accounts.verifyEmail(token, (err) => {
		if (err) {
		  console.log('Error: ', err);
		}
		else {
		  done();
		}
	  });
	});
	Accounts.onResetPasswordLink((token, done) => {
		FlowRouter.go("forgotPW", {monToken: token});
	});
}

Template.forgotPassword.events({
	"submit #formNewPW": function (event){
		event.preventDefault()
		let password1 = document.getElementById("nouveauPW").value;
		let password2 = document.getElementById("nouveauPWConf").value;
		let token = FlowRouter.getParam("monToken");

		let passwordSecurityCapital = false;
		let passwordSecurityLength = false;
		let passwordSecurityNumber = false;
		let passwordSecurity = false;
		let monMDPTest = password1.split("");

		//si les deux mots de passes ne sont pas les mêmes
		if(password1!=password2){
			alert("Les mots de passes ne sont pas les mêmes !");
		}
		//si les conditions de sécurité sont remplies
		else if(password1 == password2){
			monMDPTest.forEach(function(element){
				if(element == element.toUpperCase()){
					passwordSecurityCapital = true;
				}
				if(!isNaN(element)){
					passwordSecurityNumber = true;
				}
			});
			if(monMDPTest.length >= 8){
				passwordSecurityLength = true;
			}
			if(passwordSecurityCapital && passwordSecurityLength && passwordSecurityNumber){
				passwordSecurity = true;
			}
		}

		//si les conditions de sécurités ne sont pas remplies
		if(!passwordSecurity){
			if(!passwordSecurityCapital){
				alert("Veuillez avoir au moins une lettre majuscule");
			}
			else if(!passwordSecurityNumber){
				alert("Veuillez avoir au moins un lettre");
			}
			else if(!passwordSecurityLength){
				alert("Veuillez entrer un mot de passe d'au moins 8 caractères");
			}
		}
		else if(passwordSecurity){
			Accounts.resetPassword(token, password1, ()=>
		{
			FlowRouter.go("home");
		});
		}
	},

	//fonction pour l'indication de la foce du MDP
	'keyup #nouveauPW': function(event){
		event.preventDefault();

		let monCritere1 = document.getElementById("critere1");
		let monCritere2 = document.getElementById("critere2");
		let monCritere3 = document.getElementById("critere3");
		let maLettre = event.target.value.split("");

		let countCapital = 0;
		let countNum = 0;

		if(maLettre.length > 0){
			//on vérifie l'entier du mot de passe à chaque nouvelle lettre
			maLettre.forEach(function(e){
				if(e == e.toUpperCase() && isNaN(e)){
					countCapital++
				}
				if(!isNaN(e)){
					countNum++;
				}
			});
			//s'il y a au moins une majuscule, passer le texte en vert
			if(countCapital > 0){
				monCritere2.style.color = "lightgreen";
			}
			//s'il y a pas de majuscule, passer le texte en rouge
			else if(countCapital < 1){
				monCritere2.style.color = "tomato";
			}
			//s'il y a au moins un chiffre, passer le texte en vert
			if(countNum > 0){
				monCritere3.style.color = "lightgreen";
			}
			//s'il y a pas de chiffre, passer le texte en rouge
			else if(countNum < 1){
				monCritere3.style.color = "tomato";
			}
		}
		//si le mdp est supprimé, passer les textes en rouge
		else{
			monCritere2.style.color = "tomato";
			monCritere3.style.color = "tomato";
		}
		//si le mdp fait 8+ caractères, le passer en vert
		if(maLettre.length >= 8){
			monCritere1.style.color = "lightgreen";
		}
		//si le mdp fait 7- caractères, le passer en rouge
		else if(maLettre.length <= 7){
			monCritere1.style.color = "tomato";
		}
	},
	'click #goHome': function(event){
		event.preventDefault();
		FlowRouter.go("home");
	}
});
  
Template.loginBtn.events({
	//quand on clique sur "se connecter", on charge la page de connexion
    'click #loginButton': function(event){
		FlowRouter.go('loginPage', {typeUsLog: "user"});
	},
	//quand on clique sur "créer un compte", on se créer un compte
    'click #registerButton': function(event){
		FlowRouter.go('registerPage', {typeUsReg: "free"});
	},
	//quand on clique sur "créer un compte payant", on se créer un compte
	'click #registerButtonPremium': function(event){
		FlowRouter.go('registerPage', {typeUsReg: "paying"});
	}
});

Template.registerPage.events({
	//fonction pour l'indication de la foce du MDP
	'keyup #passwordReg': function(event){
		event.preventDefault();

		let monCritere1 = document.getElementById("critere1");
		let monCritere2 = document.getElementById("critere2");
		let monCritere3 = document.getElementById("critere3");
		let maLettre = event.target.value.split("");

		let countCapital = 0;
		let countNum = 0;

		if(maLettre.length > 0){
			//on vérifie l'entier du mot de passe à chaque nouvelle lettre
			maLettre.forEach(function(e){
				if(e == e.toUpperCase() && isNaN(e)){
					countCapital++
				}
				if(!isNaN(e)){
					countNum++;
				}
			});
			//s'il y a au moins une majuscule, passer le texte en vert
			if(countCapital > 0){
				monCritere2.style.color = "lightgreen";
			}
			//s'il y a pas de majuscule, passer le texte en rouge
			else if(countCapital < 1){
				monCritere2.style.color = "tomato";
			}
			//s'il y a au moins un chiffre, passer le texte en vert
			if(countNum > 0){
				monCritere3.style.color = "lightgreen";
			}
			//s'il y a pas de chiffre, passer le texte en rouge
			else if(countNum < 1){
				monCritere3.style.color = "tomato";
			}
		}
		//si le mdp est supprimé, passer les textes en rouge
		else{
			monCritere2.style.color = "tomato";
			monCritere3.style.color = "tomato";
		}
		//si le mdp fait 8+ caractères, le passer en vert
		if(maLettre.length >= 8){
			monCritere1.style.color = "lightgreen";
		}
		//si le mdp fait 7- caractères, le passer en rouge
		else if(maLettre.length <= 7){
			monCritere1.style.color = "tomato";
		}

	},
	'submit #formRegister': function(event){
		event.preventDefault();

		//récupération des infos des inputs
		let nomFam = document.getElementById("surnameReg").value;
		let prenomUt = document.getElementById("nameReg").value;
		let emailAdrs = document.getElementById("emailReg").value;
		let motDePasse = document.getElementById("passwordReg").value;
		let motDePasseConfirmation = document.getElementById("passwordRegConf").value;

		let nomComplet = prenomUt + " " + nomFam;

		let passwordSecurityCapital = false;
		let passwordSecurityLength = false;
		let passwordSecurityNumber = false;
		let passwordSecurity = false;
		let monMDPTest = motDePasse.split("");

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
			alert("Les mots de passes ne sont pas les mêmes !");
		}
		//si les conditions de sécurité sont remplies
		else if(motDePasse == motDePasseConfirmation){
			monMDPTest.forEach(function(element){
				if(element == element.toUpperCase()){
					passwordSecurityCapital = true;
				}
				if(!isNaN(element)){
					passwordSecurityNumber = true;
				}
			});
			if(monMDPTest.length >= 8){
				passwordSecurityLength = true;
			}
			if(passwordSecurityCapital && passwordSecurityLength && passwordSecurityNumber){
				passwordSecurity = true;
			}
		}

		//si les conditions de sécurités ne sont pas remplies
		if(!passwordSecurity){
			if(!passwordSecurityCapital){
				alert("Veuillez avoir au moins une lettre majuscule");
			}
			else if(!passwordSecurityNumber){
				alert("Veuillez avoir au moins un lettre");
			}
			else if(!passwordSecurityLength){
				alert("Veuillez entrer un mot de passe d'au moins 8 caractères");
			}
		}
		
		//si l'adress email est invalide
		if(!emailAdrs.match(re)){
			alert("Votre email n'est pas valide !");
		}

		//s'il manque le nom/prénom
		if(!prenomUt || !nomFam){
			alert("Veuillez entrer un nom/prénom !");
		}
		if(emailAdrs.match(re) && prenomUt && nomFam && passwordSecurity){
			//modifier le pseudo de l'utilisateur si un autre utilisateur a le même 
			//--> transforme "johnsmith" en "johnsmith1" si le premier existe, "johnsmith1" en "johnsmith2" si "johnsmith1" existe, etc
			if(Meteor.users.findOne({username: pseudo})){
				while(Meteor.users.findOne({username: pseudo})){
					pseudo = pseudoOriginal + i
					i++;
				}
			}
			let monMail = "<p>Bonjour,</p><p>Vos identifiants Emaua sont les suivants :</p><p><ul><li>Nom d'utilisateur : "+pseudo+"</li><li>E-mail: "+emailAdrs+"</li><li>Mot de passe : "+motDePasse+"</li></ul></p><p>Meilleures salutations,<br />L'équipe Emaua</p>"+'<p style="font-size:10px;"><em>Cet email est envoyé automatiquement ; veuillez ne pas y répondre.<br />Pour contacter Emaua, veuillez nous contacter en utilisant'+" l'adresse suivante : "+'<a href="mailto:info@emaua.org">info@emaua.org</a>.</em></p>'

			//creation user selon si c'est via code ou non
			//SI IL EST CRÉÉ SANS CODE :
			if(codeT!="" && codeT!="free" && codeT!="paying"){
				id = Accounts.createUser({
					username: pseudo,
					email: emailAdrs,
					password: motDePasse,
					profile: {
						isAdmin: monAdmin,
						fullName: nomComplet,
						userTier: 0,
						trees: [codeT]
					}
				}, function(error){
					//s'il y a un problème, dire ce qui n'a pas marché
					if(error){
						alert(error.reason);
					}
					else{
						//si le user se crée un compte après avoir entré un code, lui attribuer cet arbre dans la collection TreeCollection
						TreeCollection.update({_id: TreeCollection.findOne({codeArbre: FlowRouter.getParam("typeUsReg")})._id}, 
											  {$set: {nomUtilisateur: pseudo}});
						//envoyer un mail de bienvenue avec les identifiants
						Meteor.call(
							'sendEmail',
							emailAdrs,
							'Emaua <emaua.info@gmail.com>',
							"Vos identifiants Emaua",
							monMail
						);
						//se connecter et revenir à la page HOME, qui sera changée puisque le currentuser() est actif
						FlowRouter.go("home");
					}
				});
			}
			//S'IL EST CRÉÉ AVEC UN CODE
			else{
				id = Accounts.createUser({
					username: pseudo,
					email: emailAdrs,
					password: motDePasse,
					profile: {
						isAdmin: monAdmin,
						fullName: nomComplet,
						userTier: 0,
						trees: []
					}
				}, function(error){
					//s'il y a un problème, dire ce qui n'a pas marché
					if(error){
						alert(error.reason);
					}
					else{
						//envoyer un mail de bienvenue avec les identifiants
						Meteor.call(
							'sendEmail',
							emailAdrs,
							'Emaua <emaua.info@gmail.com>',
							"Vos identifiants Emaua",
							monMail
						);
						FlowRouter.go("home");
					}
				});
			}
		}
	},
	//si on annule, revenir en arrière
	'click #annulerReg': function(event){
		event.preventDefault();
		FlowRouter.go('home', { _id: Meteor.userId()});
	}
})

Template.loginPage.events({
	//Fonctione pour se log-in
	'submit #formLogin': function(event){
		event.preventDefault();

		//récupérer les inputs (username + password)
		let nomUt = document.getElementById("usernameLogin").value;
		let mdpUt = document.getElementById("passwordLogin").value;
		let re = /\S+@\S+\.\S+/;

		//pouvoir se connecter avec l'adresse email
		if(nomUt.match(re)){
			Meteor.loginWithPassword({email: nomUt}, mdpUt, function(error){
				//s'il y a un problème, dire lequel
				if(error){
					alert(error.reason);
				}
				else{
					//si l'utilisateur se connecte après avoir entré un code, lui attribuer cet arbre dans la collection TreeCollection
					if(FlowRouter.getParam("typeUsLog")!="user"){
						Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": FlowRouter.getParam("typeUsLog")}});
						TreeCollection.update({_id: TreeCollection.findOne({codeArbre: FlowRouter.getParam("typeUsLog")})._id}, 
											  {$set: {nomUtilisateur: Meteor.users.findOne({_id: Meteor.userId()}).username}}
						);
					}
					//dans tous les cas, revenir à la page HOME
					FlowRouter.go('home');
				}
			});
		}
		//pouvoir se connecter avec son username
		else if(!nomUt.match(re)){
			Meteor.loginWithPassword({username: nomUt}, mdpUt, function(error){
				//s'il y a un problème, dire lequel
				if(error){
					alert(error.reason);
				}
				else{
					//si l'utilisateur se connecte après avoir entré un code, lui attribuer cet arbre dans la collection TreeCollection
					if(FlowRouter.getParam("typeUsLog")!="user"){
						Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": FlowRouter.getParam("typeUsLog")}});
						TreeCollection.update({_id: TreeCollection.findOne({codeArbre: FlowRouter.getParam("typeUsLog")})._id}, 
											  {$set: {nomUtilisateur: Meteor.users.findOne({_id: Meteor.userId()}).username}}
						);
					}
					//dans tous les cas, revenir à la page HOME
					FlowRouter.go('home');
				}
			});
		}
	},
	//si on annule, revenir en arrière
	'click #annulerLogin': function(event){
		event.preventDefault();
		FlowRouter.go('home');
	},
	'click #forgotPassword': function(event){
		event.preventDefault();
		document.getElementById("hiddenPass0").style.display = "block";
		document.getElementById("hiddenPass1").style.display = "block";
		document.getElementById("hiddenPass2").style.display = "block";
		document.getElementById("hiddenPass3").style.display = "block";
		document.getElementById("hiddenPass4").style.display = "block";
		document.getElementById("elementToHide1").style.display = "none";
		document.getElementById("elementToHide2").style.display = "none";
		document.getElementById("elementToHide3").style.display = "none";
		document.getElementById("elementToHide4").style.display = "none";
		document.getElementById("elementToHide5").style.display = "none";
		document.getElementById("elementToHide6").style.display = "none";
		document.getElementById("elementToHide7").style.display = "none";
	},
	'click #annulerForgot': function(event){
		event.preventDefault();
		document.getElementById("hiddenPass0").style.display = "none";
		document.getElementById("hiddenPass1").style.display = "none";
		document.getElementById("hiddenPass2").style.display = "none";
		document.getElementById("hiddenPass3").style.display = "none";
		document.getElementById("hiddenPass4").style.display = "none";
		document.getElementById("elementToHide1").style.display = "block";
		document.getElementById("elementToHide2").style.display = "block";
		document.getElementById("elementToHide3").style.display = "block";
		document.getElementById("elementToHide4").style.display = "block";
		document.getElementById("elementToHide5").style.display = "block";
		document.getElementById("elementToHide6").style.display = "block";
		document.getElementById("elementToHide7").style.display = "block";
	},
	'submit #formForgot': function(event){
		event.preventDefault();
		let monMail = document.getElementById('emailUserForgot').value;
		let user = Meteor.users.findOne({'emails.address': monMail});
		let id = user._id;
		Meteor.call('sendForgotEmail', id, function(){
			alert("Un email vous a été envoyé à l'adresse " + monMail);
		});
	}
});

Template.changePassword.events({
	//fonction pour changer son mot de passe
	'submit #formChangePass': function(event){
		event.preventDefault();

		let oldPW = document.getElementById('oldPass').value;
		let newPW = document.getElementById('newPass').value;
		let newPWConf = document.getElementById('newPassConf').value;
		let samePW = false;

		let passwordSecurityCapital = false;
		let passwordSecurityLength = false;
		let passwordSecurityNumber = false;
		let passwordSecurity = false;
		let monMDPTest = newPW.split("");

		//vérifier que la personne a bien entré 2 fois le même MDP
		if(newPW != newPWConf){
			alert("Veuillez entrer 2 fois le même mot de passe");
		}
		//si les conditions de sécurité sont remplies
		if(newPW == newPWConf){
			samePW = true;
			monMDPTest.forEach(function(element){
				if(element == element.toUpperCase()){
					passwordSecurityCapital = true;
				}
				if(!isNaN(element)){
					passwordSecurityNumber = true;
				}
			});
			if(monMDPTest.length >= 8){
				passwordSecurityLength = true;
			}
			if(passwordSecurityCapital && passwordSecurityLength && passwordSecurityNumber){
				passwordSecurity = true;
			}
		}

		//si les conditions de sécurités ne sont pas remplies
		if(!passwordSecurity){
			if(!passwordSecurityCapital){
				alert("Veuillez avoir au moins une lettre majuscule");
			}
			else if(!passwordSecurityNumber){
				alert("Veuillez avoir au moins un lettre");
			}
			else if(!passwordSecurityLength){
				alert("Veuillez entrer un mot de passe d'au moins 8 caractères");
			}
		}

		//si c'est le cas, créer un nouveau mot de passe
		if(samePW && passwordSecurity){
			Accounts.changePassword(oldPW, newPW, function(error){
				if(error){
					alert(error.reason);
				}
				//prévenir le user que c'est fait
				else{
					alert("Mot de passe modifié !");
					FlowRouter.go("home");
				}
			})
		}
	},
	//fonction pour indiquer au user la force de son mot de passe
	'keyup #newPass': function(event){
		event.preventDefault();

		let monCritere1 = document.getElementById("critere1");
		let monCritere2 = document.getElementById("critere2");
		let monCritere3 = document.getElementById("critere3");
		let maLettre = event.target.value.split("");

		let countCapital = 0;
		let countNum = 0;

		if(maLettre.length > 0){
			//on vérifie l'entier du mot de passe à chaque nouvelle lettre
			maLettre.forEach(function(e){
				if(e == e.toUpperCase() && isNaN(e)){
					countCapital++
				}
				if(!isNaN(e)){
					countNum++;
				}
			});
			//s'il y a au moins une majuscule, passer le texte en vert
			if(countCapital > 0){
				monCritere2.style.color = "lightgreen";
			}
			//s'il y a pas de majuscule, passer le texte en rouge
			else if(countCapital < 1){
				monCritere2.style.color = "tomato";
			}
			//s'il y a au moins un chiffre, passer le texte en vert
			if(countNum > 0){
				monCritere3.style.color = "lightgreen";
			}
			//s'il y a pas de chiffre, passer le texte en rouge
			else if(countNum < 1){
				monCritere3.style.color = "tomato";
			}
		}
		//si le mdp est supprimé, passer les textes en rouge
		else{
			monCritere2.style.color = "tomato";
			monCritere3.style.color = "tomato";
		}
		//si le mdp fait 8+ caractères, le passer en vert
		if(maLettre.length >= 8){
			monCritere1.style.color = "lightgreen";
		}
		//si le mdp fait 7- caractères, le passer en rouge
		else if(maLettre.length <= 7){
			monCritere1.style.color = "tomato";
		}

	},
	'click #homeBtn': function(event){
		event.preventDefault();
		FlowRouter.go("home");
	}
})

Template.disconnectHeader.events({
	//fonction pour se déconnecter
	'click #disconnectUser': function(event){
		event.preventDefault();
		Meteor.logout();
		FlowRouter.go('home');
	},
	//fonction admin pour aller ajouter des arbres
    'click #addTreeBtn': function(event){
        event.preventDefault();
        FlowRouter.go("addTreeForm");
    },
	//aller à la page pour changer le mdp
	'click #changePassword': function(event){
		event.preventDefault();
		FlowRouter.go("newPassword");
	},
	//envoyer un mail de vérification quand on clique sur le bouton approprié
	'click #verifyEmail': function(event){
		event.preventDefault();
		let user = Meteor.users.findOne({_id: Meteor.userId()});
		let id = user._id;
		let mail = user.emails[0].address;
		Meteor.call('sendVerEmail', id, function(){
			console.log("email sent");
		});
	},
	//fonction pour upgrade un user en admin
    'submit #submitNewAdmin': function(event){
        event.preventDefault();
        let monInput = document.getElementById('usernameHeader');
        let monUsername = monInput.value;
		let monUser = Meteor.users.findOne({username: monUsername});

        //Si le user existe
        if(monUser){
			//si le user n'est pas déjà admin, le passer admin
            if(!monUser.profile.isAdmin){
              Meteor.users.update({_id: monUser._id}, {$set: {'profile.isAdmin': true}});
              alert("admin ajouté !")
            }
			//sinon dire que l'utilisateur est déjà admin
            else{
              alert("L'utilisateur est déjà admin !")
            }
              }
    	//si le user cherché n'existe pas, le dire
    	else{
    	    alert("username invalide")
    	}
        //vider l'input
        monInput.value = "";
    },
	//fonction pour downgrade un admin en user
    'submit #submitLessAdmin': function(event){
        event.preventDefault();
        let monInput = document.getElementById('usernameRemoveHeader');
        let monUsername = monInput.value;
		let monUser = Meteor.users.findOne({username: monUsername});

        //Si l'admin existe
        if(monUser){
			//s'il est admin, le downgrade
            if(monUser.profile.isAdmin){
              Meteor.users.update({_id: monUser._id}, {$set: {'profile.isAdmin': false}});
              alert("admin retiré !")
            }
			//sinon, dire qu'il n'est déjà pas admin
            else{
              alert("L'utilisateur n'est déjà plus admin !")
            }
        }
    	//sinon prévenir le user
    	else{
    	    alert("username invalide")
    	}
        //vider l'input
        monInput.value = "";
    }
});

Template.disconnectHeader.helpers({
	//donner le nom de l'utilisateur dans le header, ainsi que son niveau de donateur
	nomUser: function(){
		if(Meteor.userId()){
			let monUsername = Meteor.users.findOne({_id: Meteor.userId()}).profile.fullName;
			let monUserLevel = Meteor.users.findOne({_id: Meteor.userId()}).profile.userTier;
			let monUserStars = "";

			//pour chaque niveau du donateur, ajouter une étoile
			for(let i = 0; i <= monUserLevel; i++){
				monUserStars += "☆";
			}

			return(monUsername + " | " + monUserStars);
		}
    },
	//afficher le nom d'un admin (pas d'étoile)
	nomUserNoStar: function(){
		if(Meteor.userId()){
			let monUsername = Meteor.users.findOne({_id: Meteor.userId()}).profile.fullName;

        	return(monUsername + " | Admin");
		}
		
	},
	//savoir si l'utilisateur qui observe la page est administrateur
    'isAdmin': function(){
        if(Meteor.userId()){
			let myID = Meteor.userId();
			let requete = Meteor.users.findOne({_id: myID});
			if(requete.profile.isAdmin){
				Template.instance().isAdmin = new ReactiveVar(true);
			}
			else {
				Template.instance().isAdmin = new ReactiveVar(false);
			}
			return Template.instance().isAdmin.get();
		}
    },
	//savoir si l'utilisateur qui observe la page a vérifié son adresse email
	'isVerified': function(){
        if(Meteor.userId()){
			let myID = Meteor.userId();
			let requete = Meteor.users.findOne({_id: myID});
			let email = requete.emails[0].verified;
			if(email){
				Template.instance().isVerified = new ReactiveVar(true);
			}
			else{
				Template.instance().isVerified = new ReactiveVar(false);
			}
			return Template.instance().isVerified.get();
		}
	},
	//savoir s'il l'on regarde la page principale ou non
	'isMainPage': function(){
		if(Meteor.userId()){
			let maPage = FlowRouter.getRouteName();
			if(maPage == "home"){
				Template.instance().isMainPage = new ReactiveVar(true);
			}
			else{
				Template.instance().isMainPage = new ReactiveVar(false);
			}
			return Template.instance().isMainPage.get();
		}
	}
});

Template.disconnectHeader.onRendered(function(){
	if(Meteor.userId()){
		//afficher le nombre approprié d'étoiles en fonction de nombre d'arbres plantés
		//vérifier combien d'arbres un user a planté
		let monUser = Meteor.users.findOne({_id: Meteor.userId()});
		let userTrees = monUser.profile.trees;
		let nbr = 0;
		userTrees.forEach(function(element){
			let monArbre = TreeCollection.findOne({codeArbre: element});
			nbr += monArbre.nombreArbres;
		});
		//s'il en a planté - que 5'000, il est de niveau 0
		//s'il en a planté + que 5'000, il est de niveau 1
		if(nbr>5000){
			if(monUser.profile.userTier < 1){
				Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.userTier": 1}});
			}
		}
		//s'il en a planté + que 10'000, il est de niveau 2
		if(nbr>10000){
			if(monUser.profile.userTier < 2){
				Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.userTier": 2}});
			}
		}
		//s'il en a planté + que 25'000, il est de niveau 3
		if(nbr>25000){
			if(monUser.profile.userTier < 3){
				Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.userTier": 3}});
			}
		}
		//s'il en a planté + que 50'000, il est de niveau 4
		if(nbr>50000){
			if(monUser.profile.userTier < 4){
				Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.userTier": 4}});
			}
		}
		//s'il en a planté + que 100'000, il est de niveau 5
		if(nbr>100000){
			if(monUser.profile.userTier < 5){
				Meteor.users.update({_id: Meteor.userId()},{$set: {"profile.userTier": 5}});
			}
		}

		//Vérifier si tous les arbres auquel le user a contribué lui sont attribué
		let arbresUser = []
		TreeCollection.find({nomUtilisateur: monUser.username}).forEach(function(element){
			arbresUser.push(element.codeArbre);
		});
		let treesUser = monUser.profile.trees;

		//si un arbre a été ajouté dans la BDD sans que le user l'ai ajouté lui-même, lui les attribuer automatiquement
		let treesToAdd = arbresUser.filter(x => !treesUser.includes(x));
		if(treesToAdd!=[]){
			treesToAdd.forEach(function(element){
				Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": element}});
			});
		}
	}
});