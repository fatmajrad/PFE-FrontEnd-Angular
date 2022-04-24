import { Reponse } from "./reponse.model";
import { Sujet } from "./sujet.model";
import { User } from "./user.model";

export class Question{
   id: number;
   user:User;
   intituleQuestion: Text;
   descriptionQuestion: Text;
   tag: Sujet[];
   reponses : Reponse[]; 
   brouillon : Boolean;
   statutValidation:Boolean;
 
  
   

}