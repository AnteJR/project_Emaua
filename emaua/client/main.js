import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../imports/api/arbres.js';
import { Tracker } from 'meteor/tracker';

import '../imports/ui/connexion.js'
import '../imports/ui/affichageArbres.js'

//côté client
Meteor.startup(()=>{
	Tracker.autorun(()=> {
        //on abonne les users à la collection des arbres
        Meteor.subscribe('users', function () {
            if(Meteor.userId()){
                if(Meteor.users.findOne({_id: Meteor.userId()}).profile.isAdmin){
                    return Meteor.users.find();
                }
                else if(!Meteor.users.findOne({_id: Meteor.userId()}).profile.isAdmin){
                    return Meteor.users.findOne({_id: Meteor.userId()});
                }
            }
            else{
                return Meteor.users.find();
            }
        });
        Meteor.subscribe('arbres', function (_id) {
        	return TreeCollection.find()
        });
    });
});