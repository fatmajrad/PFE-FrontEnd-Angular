import { Reponse } from "./reponse.model";
import { Sujet } from "./sujet.model";
import { User } from "./user.model";

export class Question{
   id: number;
   user:User;
   intituleQuestion: String;
   descriptionQuestion: Text;
   tag: Sujet[];
   reponses : Reponse[]; 
   statut:string;
  remarque: String;
  commentaire: import("c:/PFE/Pfe-Platforme de partage de connaissance/Frontend Angular/testRepo/src/app/models/commentaire.model").Commentaire;
 
  
   

}