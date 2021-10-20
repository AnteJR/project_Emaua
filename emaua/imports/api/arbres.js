//Import des méthodes
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//constante pour la base de donnée
export const TreeCollection = new Mongo.Collection('arbres');

//méthodes
Meteor.methods({
    //méthode 1: ajouter un arbre à la BDD avec les infos données
    'arbres.addTree'(username,date,nbr,gps,codeTree){

        //récupérer le contenu des inputs
        check(username, String);
        check(date, String);
        check(nbr, Number);
        check(gps, String);
        check(codeTree, String);

        //si on a un username : créer un arbre avec un proprio
        if(username){
            TreeCollection.insert({
                nomUtilisateur: username,
                datePlantation: date,
                nombreArbres: nbr,
                coordonneesArbres: gps,
                codeArbre: codeTree
            })
        }

        //si on a pas un username : créer un arbre sans proprio
        else{TreeCollection.insert({
                nomUtilisateur: "EN ATTENTE DE CODE",
                datePlantation: date,
                nombreArbres: nbr,
                coordonneesArbres: gps,
                codeArbre: codeTree
            })
        }
    }
    //futures (éventuelles) méthodes:
    //1. ajouter des photos
    //2. ajouter une description
    //3. ajouter une mise à jour
});