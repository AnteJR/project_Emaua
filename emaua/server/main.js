import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../imports/api/arbres.js';
import { Tracker } from 'meteor/tracker';

Meteor.startup(() => {
  // code to run on server at startup
  Tracker.autorun(()=>{
		Meteor.publish('arbres', function () {
			return Semaines.find({},{
				'_id':1,
				'nomUtilisateur': 1,
        'datePlantation': 1,
        'nombreArbres': 1,
        'coordonneesArbres': 1,
        'codeArbre': 1
			});
		});
    TreeCollection.allow({
      insert() {return true},
      update() {return true},
      remove() {return true}
    });
	});
});