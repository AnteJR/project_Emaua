import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../api/arbres.js';

import '../../client/lib/routes.js';
import '../templates/app.html';
import '../templates/addTreeForm.html';
import '../templates/addUpdateForm.html';
import '../templates/loginBtnTrees.html';
import '../templates/addTreeCode.html';
import '../templates/treeMaps.html';
import '../templates/disconnectHeader.html';
import '../templates/footerApp.html';
import { isNumeric } from 'jquery';

Template.addTreeCode.helpers({
    //afficher le code entré
    codeArbre: function(){
        let code = FlowRouter.getParam('codeArbre');
        return(code);
    }
});

Template.loginBtnTrees.events({
    //pouvoir se créer un compte en ajoutant un code
    'click #registerButtonT': function(event){
        event.preventDefault();
        let code = FlowRouter.getParam('codeArbre');
        FlowRouter.go("registerPage", {typeUsReg: code});
    },
    //pouvoir se connecter en ajoutant un code
    'click #loginButtonT': function(event){
        event.preventDefault();
        let code = FlowRouter.getParam('codeArbre');
        FlowRouter.go("loginPage", {typeUsLog: code});
    },
    'click #annulerCode': function(event){
        event.preventDefault();
        FlowRouter.go('home');
    }
});

Template.mainPage.onRendered(function() {
    //Load Google Maps API
    GoogleMaps.load({v: '3', key: 'AIzaSyC36gF29ZFZUuVMziMphdPEMcfkJti8ztM'});
});

Template.mainPage.helpers({
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
    //lister les projets du user
    'treeProjects': function () {
        if(Meteor.userId()){
            return Meteor.users.find({_id: Meteor.userId()}).fetch();
        }
    },
    //savoir si l'utilisateur a son email qui est vérifié
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
    fullMapOptions: function() {
        //s'arrurer que l'API Google Maps est chargé
        if (GoogleMaps.loaded()) {
            //options d'initialisation de la Map
            return {
                center: new google.maps.LatLng(0.742872, 34.387666),
                zoom: 9,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };
        }
    }
});

//Google Maps pour la carte avec TOUS les projets
Template.mainPage.onCreated(function() {
    if(Meteor.userId()){
        setTimeout(function(){
            //récupérer les geolocalisation des arbres et créer la liste des markers qu'on veut ajouter à la carte
            let mesArbres = TreeCollection.find();
            let mesMarkers = [];
            
            mesArbres.forEach(function(element){
                let treez = element.coordonneesArbres;
                let treezSplit = treez.split(",")
                mesMarkers.push({
                    position: new google.maps.LatLng(treezSplit[0],treezSplit[1])
                })
            });
    
            //callback pour interagir maintenant que la Map est prête
            GoogleMaps.ready('exampleMap', function(map) {
            //ajouter un marquer à la latitude/longitude indiquées
            for (let i = 0; i < mesMarkers.length; i++) {
                    const marker = new google.maps.Marker({
                        position: mesMarkers[i].position,
                        //icon: "pin.png",
                        map: map.instance,
                    });
                }
            });
        },250);
    }
  });


Template.mainPage.events({
    //soumettre un code
    'submit #codeButton': function(event){
        event.preventDefault();

        //récupérer le contenu des inputs
		let myCode = document.getElementById("monCode").value;
        let monArbre = TreeCollection.findOne({codeArbre: myCode});

        //si on trouve un arbre qui correspond...
		if(TreeCollection.findOne({codeArbre: myCode})){
            //si l'arbre a déjà un proprio, on explique que le code est déjà utilisé
            if(!monArbre.dispo){
                alert("Le code est déjà utilisé :(")
            }
            //si l'arbre est dispo, on lui ajoute un proprio
            else{
                FlowRouter.go('addTreeCode', {codeArbre: myCode});
            }
		}
        //si le code n'est pas de la bonne longueur
		else if(myCode.length > 5 || myCode.length < 5){
			alert("Veuillez entrer un code à 5 caractères");
		}
        //si le code est invalide
		else if(!TreeCollection.findOne({codeArbre: myCode})){
			alert(myCode + " code invalide !");
		}
	},
    'click .lienArbres': function(event){
        event.preventDefault();
        let selectProject = this;
        FlowRouter.go("project", {codeArbre: selectProject});
    },
    'click #validateEmail': function(event){
        event.preventDefault();
		if(Meteor.userId()){
            Meteor.call('sendVerEmail', Meteor.userId(), function(){
                alert("Email de vérification envoyé !");
            });
        }
    }
});

Template.addTreeForm.events({
    //fonctione pour ajouter un arbre aux bases de données
    'click #submitTree': function(event){
        event.preventDefault();

        //on récupère toutes les données des inputs
        let nameT = document.getElementById("nomTree").value;
        let dateT = document.getElementById("dateTree").value;
        let nbrT = document.getElementById("nbrTree").value;
        let latLongT = document.getElementById("latLongTree").value;

        let pseudo = "";

        //établissement automatique d'un pseudo qui transforme "John Smith" en "johnsmith"
		if(nameT){
		    let nomPrenom = nameT.split(" ");
            nomPrenom.forEach(element => pseudo += element.toLowerCase());
        }

        //on génère un code aléatoire
        let charCode = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
        let codeT = "";
        for(let i=0; i<5; i++){
            let randomNbr = Math.floor(Math.random()*36);
            codeT += charCode[randomNbr];
        }

        //vérifier que le code n'existe pas déjà
        let canFindTree = TreeCollection.findOne({codeArbre: codeT});
        while(canFindTree){
            codeT = "";
            for(let i=0; i<5; i++){
                let randomNbr = Math.floor(Math.random()*36);
                codeT += charCode[randomNbr];
            }
            canFindTree = TreeCollection.findOne({codeArbre: codeT});
        }

        //on créer une entrée dans la base de donnée
        Meteor.call('arbres.addTree', pseudo, dateT, nbrT, latLongT, codeT);
    },
    //revenir à la page d'accueil
    'click #homeButton': function(event){
        event.preventDefault();
        FlowRouter.go("home");
    },
    //mise en ligne de fichiers pour peupler la base de donnée des projets
    'change #myfile': function(event){
        //récupérer le fichier
        const fileList = event.target.files;
        if(fileList){
            //lire le fichier CSV pour obtenir une variable JSON
            let csvToParse = fileList[0];
            const myTrees = Papa.parse(csvToParse, {
                complete: function(results) {
                    //variable JSON qui contient TOUTES les lignes du fichier CSV
                    let myTreesData = results.data;
                    
                    //boucle pour passer à travers TOUT le fichier JSON, ligne par ligne
                    for(let i=2; i<myTreesData.length; i++){
                        let dateT = myTreesData[i][0];
                        let projectNumber = myTreesData[i][1];
                        let nameT = myTreesData[i][10];
                        let latLongT = myTreesData[i][9];
                        let nbrT = myTreesData[i][4];

                        let monNum = projectNumber;
                        projectNumber = parseInt(monNum);
        
                        //date au bon format
                        if(dateT!=""){
                            let newDate = dateT.split("/");
                            dateT = "";
                            dateT += newDate[2];
                            dateT += "-";
                            dateT += newDate[1];
                            dateT += "-";
                            dateT += newDate[0];
                        }

                        //interpréter le nombre d'arbres comme un nombre entier (Int)
                        let nbr = nbrT.split(",");
                        let monNombre = nbr[0]+nbr[1];
                        nbrT = parseInt(monNombre);

                        //établissement automatique d'un pseudo qui transforme "John Smith" en "johnsmith"
                        let pseudo = "";
                        if(nameT){
                            let nomPrenom = nameT.split(" ");
                            nomPrenom.forEach(element => pseudo += element.toLowerCase());
                        }

                        //on génère un code aléatoire
                        let charCode = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
                        let codeT = "";
                        for(let i=0; i<5; i++){
                            let randomNbr = Math.floor(Math.random()*36);
                            codeT += charCode[randomNbr];
                        }

                        //si le code existe déjà, le remplacer
                        let canFindTree = TreeCollection.findOne({codeArbre: codeT});
                        while(canFindTree){
                            codeT = "";
                            for(let i=0; i<5; i++){
                                let randomNbr = Math.floor(Math.random()*36);
                                codeT += charCode[randomNbr];
                            }
                            canFindTree = TreeCollection.findOne({codeArbre: codeT});
                        }

                        let canFindMyTree = TreeCollection.findOne({numeroDeProjet: projectNumber});
                        
                        //si aucune entrée n'existe, on créer une entrée dans la base de donnée
                        if(!canFindMyTree){
                            if(dateT!="" && projectNumber && !isNaN(nbrT)){
                                Meteor.call('arbres.addTree', pseudo, dateT, nbrT, latLongT, codeT, projectNumber);
                            }
                        }
                        //si une entrée existe déjà
                        else if(canFindMyTree){
                            let treeOwner = canFindMyTree.nomUtilisateur;
                            let noCoordonnee = canFindMyTree.coordonneesArbres;
                            //s'il manque le nom : l'ajouter
                            if(treeOwner=="EN ATTENTE DE CODE" && pseudo!=""){
                                Tree
                                Collection.update({_id: canFindMyTree._id}, {$set: {nomUtilisateur: pseudo}});
                            }
                            //s'il manque les coordonnées, les ajouter
                            if(noCoordonnee=="" && latLongT!=""){
                                TreeCollection.update({_id: canFindMyTree._id}, {$set: {coordonneesArbres: latLongT}});
                            }
                        }
                    }
                }
            });
        }
        //s'il y a eu une erreur lors de l'importation, prévenir le user
        else{
            alert("erreur lors de l'importation")
        }
    }
});

//Maps pour chaque projet
Template.treeMaps.onRendered(function() {
    //Load Google Maps API
    GoogleMaps.load({v: '3', key: 'AIzaSyC36gF29ZFZUuVMziMphdPEMcfkJti8ztM'});
});

Template.treeMaps.helpers({
    //setup la carte Google Maps, notamment la localisation sur laquelle elle se centre
    exampleMapOptions: function() {
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        let treeLatLong = monArbre.coordonneesArbres;
        let splitTree = treeLatLong.split(",");

        //s'arrurer que l'API Google Maps est chargé
        if (GoogleMaps.loaded()) {
            //options d'initialisation de la Map
            return {
                center: new google.maps.LatLng(splitTree[0], splitTree[1]),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };
        }
    },
    //helper pour savoir qu'elle est le code du projet
    'idPlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.codeArbre;
    },
    //helper pour savoir qu'elle est la date de plantation du projet
    'datePlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.datePlantation;
    },
    //helper pour savoir qu'elle est le nombre d'arbres du projet
    'nbrPlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.nombreArbres;
    },
    //helper pour lister les updates à afficher dans un projet donné
    'updateToAdd': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        return TreeCollection.find({codeArbre: monCode}).fetch();
    }
});

Template.treeMaps.onCreated(function() {
    //callback pour interagir maintenant que la Map est prête
    GoogleMaps.ready('exampleMap', function(map) {
      //ajouter un marquer à la latitude/longitude indiquées
      var marker = new google.maps.Marker({
        position: map.options.center,
        //icon: pin.png
        map: map.instance
      });
    });
  });

  Template.treeMaps.events({
      //bouton pour revenir en arrière
    'click #backHome': function(event){
        FlowRouter.go("home");
    }
  });

Template.disconnectHeader.events({
    //fonction pour entrer un code depuis le menu déroulant dans le header
    'submit #submitCodeHeader': function(event){
        event.preventDefault();
        let monInput = document.getElementById('codeHeader');
        let monCodeArbre = monInput.value;

        //Si un projet existe et n'est pas attribué, l'attribuer
        if(TreeCollection.findOne({codeArbre: monCodeArbre}).nomUtilisateur=="EN ATTENTE DE CODE"){
            Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": monCodeArbre}});
            TreeCollection.update({_id: TreeCollection.findOne({codeArbre: monCodeArbre})._id}, 
								  {$set: {nomUtilisateur: Meteor.users.findOne({_id: Meteor.userId()}).username}}
			);
            //alerter que le  code a été utilisé
            alert("Code "+monCodeArbre+" ajouté !");
        }
        //sinon prévenir le user
        else{
            alert("Code invalide ou déjà utilisé !")
        }
        //vider l'input
        monInput.value = "";
    },
    'click #addUpdateBtn': function(event){
        event.preventDefault();
        FlowRouter.go("updateProj");
    }
});

//ajouter des updates à des projets en tant qu'admin
Template.addUpdateForm.events({
    'submit #formChangePass': function(event){
        event.preventDefault();

        //récupérer les valeurs des inputs
        let monNum = document.getElementById('numProj').value;
        let monCode = document.getElementById('codeProj').value;
        let monUpdate = document.getElementById('updateProj').value;
        let monProjet;

        //si au moins un des champs (numéro ou code) est non-vide
        if(monNum!="" || monCode!=""){
            //si c'est le numéro qui est non-vide uniquement, chercher par numéro
            if(monNum!="" && monCode==""){
                monProjet = TreeCollection.findOne({numeroDeProjet: parseInt(monNum)});
            }
            //si c'est le code qui est non-vide uniquement, chercher par code
            else if(monNum=="" && monCode!=""){
                monProjet = TreeCollection.findOne({codeArbre: monCode});
            }
            //si les deux sont rempli, vérifier qu'ils se réfèrent au même projet quand même
            else if(monNum!="" && monCode!=""){
                if(TreeCollection.findOne({numeroDeProjet: parseInt(monNum)}).codeArbre == TreeCollection.findOne({codeArbre: monCode}).codeArbre){
                    monProjet = TreeCollection.findOne({codeArbre: monCode});;
                }
                else{
                    alert("Le numéro et le code ne correspondent pas au même projet");
                }
            }
        }
        //si les champs sont tous les deux vides
        else{
            alert("Veuillez entrer un numéro ou un code de projet !")
        }

        //si on a un projet, créer une date
        if(monProjet){
            let maDate = new Date();
            let maDateAEnvoyer = "";
            //ordonner la date selon le format prédéfini
            maDateAEnvoyer += maDate.getUTCFullYear();
            maDateAEnvoyer += "-";
            maDateAEnvoyer += maDate.getMonth() + 1;
            maDateAEnvoyer += "-";
            maDateAEnvoyer += maDate.getDate();

            //appeler la méthode pour ajouter une mise à jour
            Meteor.call("arbres.addUpdate", monProjet._id, monUpdate, maDateAEnvoyer);
        }
    },
    //pouvoir revenir en arrière
    'click #btnHome': function(event){
        event.preventDefault();
        FlowRouter.go("home")
    }
});