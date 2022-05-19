import { Commentaire } from 'src/app/models/commentaire.model';
import { Question } from "./question.model";
import { User } from "./user.model";
import { Vote } from './vote.model';

export class Reponse{
    id: Number;
    contenu: Text;
    user:User;
    question:Question;
    commentaire: Commentaire[];
    vote : Vote[];
    
}