import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../imports/api/arbres.js';
import { Tracker } from 'meteor/tracker';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';

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
    if(Meteor.isServer){
      process.env.MAIL_URL = `smtps://emaua.info@gmail.com:emaua_MP21@smtp.gmail.com:465/`;

      Accounts.emailTemplates = {
        from: "Emaua <emaua.info@gmail.com",
        siteName: "Emaua",
        verifyEmail: {
          from: function () {
            return "Emaua Login <emaua.info@gmail.com";
          },
          subject: function () {
            return "Vérification de l'adresse email - Emaua";
          },
          html: function(user, url) {
            let monUrl = url.split("/");
            return '<p>Bonjour,</p><p>Merci de cliquer sur le lien suivant pour vérifier votre email.</p><p><a href="' + url + '">Vérifier mon adresse email</a></p>'+"<p>Meilleures salutations,<br />L'équipe Emaua";
          }
        }
      }
      
      //méthode pour envoyer des mails au nom d'Emaua
      Meteor.methods({
        sendEmail(to, from, subject, text) {
          //vérifier que les arguments envoyés sont du texte
          check([to, from, subject, text], [String]);
        
          //permettre d'autres fonctions de tourner pendant que le mail s'envoie, ne bloque pas tout pour l'envoi d'iun mail
          this.unblock();
          
          //envoyer l'email avec les paramètres
          Email.send({ to, from, subject, text });
        },
        sendVerEmail(userId, callback) {
          this.unblock;
          check(userId, String);
  
          Accounts.sendVerificationEmail(userId, callback);
        }
      });
    }
	});
});