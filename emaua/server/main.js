import { Meteor } from 'meteor/meteor';
import { TreeCollection } from '../imports/api/arbres.js';
import { Tracker } from 'meteor/tracker';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  // code to run on server at startup
  Tracker.autorun(()=>{
    //on publie la collection des arbres
		Meteor.publish('arbres', function () {
      if(Meteor.userId()){
        if(Meteor.users.findOne({_id: Meteor.userId()}).profile.isAdmin == true || Meteor.users.findOne({_id: Meteor.userId()}).emails[0].verified == true){
          return TreeCollection.find();
        }
      }
      else if(!Meteor.userId()){
        return TreeCollection.find({},{
          fields: {
            codeArbre: 1,
            dispo: 1,
          }
        });
      }
		});
    //on publie certaines infos des users
		Meteor.publish('users', function () {
      if(Meteor.userId()){
        if(Meteor.users.findOne({_id: Meteor.userId()}).profile.isAdmin == true){
          return Meteor.users.find({},{
            fields:{
              username:1,
              emails:1,
              profile:1,
              _id:1
            }
          });
        }
        else if(Meteor.users.findOne({_id: Meteor.userId()}).profile.isAdmin == false){
          return Meteor.users.findOne({_id: Meteor.userId()});
        }
      }
      else{
        return Meteor.users.find({},{
          fields:{
            username:1,
            'emails.address':1,
          }
        });
      }
    });
    
    //on permet d'insérer des arbres dans la collection et de les supprimer uniquement aux admins
    //les users standards peuvent les update ceci dit
	  TreeCollection.allow({
      insert: function(userId, user) {
        const currentUser = Meteor.users.findOne(userId);
        return !!currentUser && currentUser.profile.isAdmin === true;
      },
      update() {return true},
      remove: function(userId, user) {
        const currentUser = Meteor.users.findOne(userId);
        return !!currentUser && currentUser.profile.isAdmin === true;
      }
    });

    //seuls les admin peuvent toucher aux autres users
    Meteor.users.allow({
      update: function(userId, user) {
        const currentUser = Meteor.users.findOne(userId);
        return !!currentUser && currentUser.profile.isAdmin === true;
      }
    });
    
    if(Meteor.isServer){
      //on charge le serveur mail
      process.env.MAIL_URL = `smtps://emaua.info@gmail.com:emaua_MP21@smtp.gmail.com:465/`;

      //on créer des templates pour les mails automatiques
      Accounts.emailTemplates = {
        from: "Emaua <emaua.info@gmail.com>",
        siteName: "Emaua",
        //pour la vérification des adresses
        verifyEmail: {
          from: function () {
            return "Emaua Login <emaua.info@gmail.com>";
          },
          subject: function () {
            return "Vérification de l'adresse email - Emaua";
          },
          html: function(user, url) {
            return '<p>Bonjour,</p><p>Merci de cliquer sur le lien suivant pour vérifier votre email.</p><p><a href="' + url + '">Vérifier mon adresse email</a></p>'+"<p>Meilleures salutations,<br />L'équipe Emaua"+'<p style="font-size:10px;"><em>Cet email est envoyé automatiquement ; veuillez ne pas y répondre.<br />Pour contacter Emaua, veuillez nous contacter en utilisant'+" l'adresse suivante : "+'<a href="mailto:info@emaua.org">info@emaua.org</a>.</em></p>';
          }
        },
        //pour la réinitialisation des mots de passe
        resetPassword: {
          from: function () {
            return "Emaua Login <emaua.info@gmail.com>";
          },
          subject: function () {
            return "Réinitialiser le mot de passe - Emaua";
          },
          html: function(user, url) {
            return '<p>Bonjour,</p><p>Nous avons reçu une requête de réinitialisation de mot de passe pour votre compte Emaua.</p><p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :</p><p><a href="' + url + '">Réinitialiser mon mot de passe</a></p>'+"<p>Si vous n'avez pas fait la demander de réinitialisation de mot de passe, vous pouvez ignorer cet email.</p><p>Meilleures salutations,<br />L'équipe Emaua"+'<p style="font-size:10px;"><em>Cet email est envoyé automatiquement ; veuillez ne pas y répondre.<br />Pour contacter Emaua, veuillez nous contacter en utilisant'+" l'adresse suivante : "+'<a href="mailto:info@emaua.org">info@emaua.org</a>.</em></p>';
          }
        }
      }
      
      //méthode pour envoyer des mails au nom d'Emaua
      Meteor.methods({
        sendEmail(destinataire, auteur, sujet, texte) {
          //vérifier que les arguments envoyés sont du texte
          check([destinataire, auteur, sujet, texte], [String]);
        
          //permettre d'autres fonctions de tourner pendant que le mail s'envoie, ne bloque pas tout pour l'envoi d'iun mail
          this.unblock();
          
          //envoyer l'email avec les paramètres
          Email.send({ to: destinataire, from: auteur, subject: sujet, html: texte });
        },
        //méthode pour envoyer un mail de vérification d'email
        sendVerEmail(userId, callback) {
          this.unblock;
          check(userId, String);
  
          Accounts.sendVerificationEmail(userId, callback);
        },
        //méthode pour envoyer un mail de réinitialisation de mot de passe
        sendForgotEmail(userId, callback) {
          this.unblock;
          check(userId, String);
  
          Accounts.sendResetPasswordEmail(userId, callback);
        }
      });
    }
	});
});