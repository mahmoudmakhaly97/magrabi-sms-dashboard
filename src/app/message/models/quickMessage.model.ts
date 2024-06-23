export class quickMessage{
    country:number ;
    file:any
    content:string
   
}
export class smsProviderModel{
    token?:string;
    content:{
        recipients:string [];
        body: string;
        sender: string;
        scheduledDatetime: string
        deleteId?: number
    }

}