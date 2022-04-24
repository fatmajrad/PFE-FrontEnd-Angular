import { User } from "./user.model";
import { Question } from "./question.model";


export class Commentaire{
    id : Number ; 
    contenu : Text;
    user : User;
    question: Question;
     //connaissance : Connaissance; 
}