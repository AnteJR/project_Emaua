import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../imports/api/arbres.js';
import { Tracker } from 'meteor/tracker';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';

import '../imports/ui/connexion.js'
import '../imports/ui/affichageArbres.js'

Meteor.startup(()=>{
	Tracker.autorun(()=> {
        Meteor.subscribe('users', function () {
            return Meteor.users.find();
        })
        Meteor.subscribe('arbres', function (_id) {
        	if(Meteor.users.findOne(Meteor.userId()).profile.isAdmin || Meteor.users.findOne(Meteor.userId()).emails[0].verified){
                return TreeCollection.find({});
            }
        });
    });
});