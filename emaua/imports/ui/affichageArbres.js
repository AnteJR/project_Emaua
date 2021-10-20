import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../api/arbres.js';
import { Accounts } from 'meteor/accounts-base';

import '../../client/lib/routes.js';
import '../templates/app.html';
import '../templates/addTreeForm.html';
import '../templates/loginBtnTrees.html';
import '../templates/addTreeCode.html';
import '../templates/treeMaps.html';
import '../templates/disconnectHeader.html';

Template.addTreeCode.helpers({
    codeArbre: function(){
        let code = FlowRouter.getParam('codeArbre');
        return(code);
    }
});

Template.loginBtnTrees.events({
    'click #registerButtonT': function(event){
        event.preventDefault();
        let code = FlowRouter.getParam('codeArbre');
        FlowRouter.go("registerPage", {typeUsReg: code});
    },
    'click #loginButtonT': function(event){
        event.preventDefault();
        let code = FlowRouter.getParam('codeArbre');
        FlowRouter.go("loginPage", {typeUsLog: code});
    },
});

Template.mainPage.onRendered(function() {
    //Load Google Maps API
    GoogleMaps.load({v: '3', key: 'AIzaSyC36gF29ZFZUuVMziMphdPEMcfkJti8ztM'});
});

Template.mainPage.helpers({
    //savoir si l'utilisateur qui observe la page est administrateur
    'isAdmin': function(){
        let myID = Meteor.userId();
        let requete = Meteor.users.findOne({_id: myID});
        if(requete.profile.isAdmin){
            Template.instance().isAdmin = new ReactiveVar(true);
        }
        else {
            Template.instance().isAdmin = new ReactiveVar(false);
        }
        return Template.instance().isAdmin.get();
    },
    'treeProjects': function () {
        return Meteor.users.find({_id: Meteor.userId()}).fetch();
    },
    fullMapOptions: function() {
        //s'arrurer que l'API Google Maps est chargé
        if (GoogleMaps.loaded()) {
            //options d'initialisation de la Map
            return {
                center: new google.maps.LatLng(0.742872, 34.387666),
                zoom: 9,
                mapTypeId: 'satellite'
            };
        }
    }
});

Template.mainPage.onCreated(function() {
    
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
                icon:'https://i.ibb.co/NZZ87vK/pin.png',
                map: map.instance,
            });
        }
    });
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
            if(monArbre.nomUtilisateur!="EN ATTENTE DE CODE"){
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
    'click #homeButton': function(event){
        event.preventDefault();
        FlowRouter.go("home");
    },
    'change #myfile': function(event){
        const fileList = event.target.files;
        if(fileList){
            let csvToParse = fileList[0];
            console.log(csvToParse)
            const myTrees = Papa.parse(csvToParse, {
                complete: function(results) {
                    let myTreesData = results.data;
                    console.log(myTreesData)
                
                    for(let i=2; i<myTreesData.length; i++){
                        let dateT = myTreesData[i][0];
                        let nameT = myTreesData[i][10];
                        let latLongT = myTreesData[i][9];
                        let nbrT = myTreesData[i][4];
        
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

                        //check si une entrée pour l'arbre existe déjà
                        let canFindTreeGPS = TreeCollection.findOne({coordonneesArbres: latLongT});
                        let canFindTreeDate = TreeCollection.findOne({datePlantation: dateT});
                        let canFindTreeNbre = TreeCollection.findOne({nombreArbres: nbrT});
                        let canFindTreeOwner;
                        let treeExists = false;

                        if(canFindTreeDate && canFindTreeGPS && canFindTreeNbre){
                            treeExists = true;
                            canFindTreeOwner = canFindTreeDate.nomUtilisateur;
                            console.log(canFindTreeOwner);
                        }
                        
                        //si aucune entrée n'existe, on créer une entrée dans la base de donnée
                        if(treeExists==false){
                            if(latLongT!="" && dateT!=""){
                                Meteor.call('arbres.addTree', pseudo, dateT, nbrT, latLongT, codeT);
                            }
                        }
                        else if(treeExists==true){
                            if(canFindTreeOwner=="EN ATTENTE DE CODE" && pseudo!=""){
                                TreeCollection.update({_id: canFindTreeNbre._id}, {$set: {nomUtilisateur: pseudo}});
                            }
                        }
                    }
                }
            });
        }
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
                zoom: 12,
                mapTypeId: 'satellite'
            };
        }
    },
    'idPlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.codeArbre;
    },
    'datePlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.datePlantation;
    },
    'nbrPlant': function(){
        let monCode = FlowRouter.getParam('codeArbre');
        let monArbre = TreeCollection.findOne({codeArbre: monCode});
        return monArbre.nombreArbres;
    }
});

Template.treeMaps.onCreated(function() {
    //callback pour interagir maintenant que la Map est prête
    GoogleMaps.ready('exampleMap', function(map) {
      //ajouter un marquer à la latitude/longitude indiquées
      var marker = new google.maps.Marker({
        position: map.options.center,
        icon:'https://i.ibb.co/NZZ87vK/pin.png',
        map: map.instance
      });
    });
  });

  Template.treeMaps.events({
    'click #backHome': function(event){
        FlowRouter.go("home");
    }
  });

Template.disconnectHeader.events({
    'submit #submitCodeHeader': function(event){
        event.preventDefault();

        let monInput = document.getElementById('codeHeader');
        let monCodeArbre = monInput.value;

        if(TreeCollection.findOne({codeArbre: monCodeArbre}).nomUtilisateur=="EN ATTENTE DE CODE"){
            Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.trees": monCodeArbre}});
            TreeCollection.update({_id: TreeCollection.findOne({codeArbre: monCodeArbre})._id}, 
								  {$set: {nomUtilisateur: Meteor.users.findOne({_id: Meteor.userId()}).username}}
			);
            alert("Code "+monCodeArbre+" ajouté !");
        }
        else{
            alert("Code invalide ou déjà utilisé !")
        }

        monInput.value = "";
    }
});