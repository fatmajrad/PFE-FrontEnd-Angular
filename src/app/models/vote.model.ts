import { Connaissance } from 'src/app/models/connaissance.modal';
import { User } from "./user.model";
import { Question } from "./question.model";

export class Vote{
    id : Number ; 
    contenu : Text;
    user : User;
    typeVote: Boolean;
    Connaissance : Connaissance;
    Reponses : Vote;
    Question : Question;
}