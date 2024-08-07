import { userList } from "./user.model"

export class tempConfig{
    id:number 
    templateName: string
    templateID:number
    sendAt: string
    sendAfter: number
    nationality?: string
    gender: string
    regionID: number
    contentEn: string
    contentAr: string
    run: boolean
    sendAfterReminder? : number
    isReminder? : boolean
}

export class tempList{
    id:number 
    templateName: string
    templateID:number
    sendAt: string
    sendAfter: number
    nationality?: string
    gender: string
    regionID: number
    contentEn: string
    contentAr: string
    run: boolean
    userList?:userList[]
    sendAfterReminder? : number
    isReminder? : boolean
  status: string
}

// export class smsProviderTemplate{
//     recipients: [];
//     body: string;
//     sender: string;
//     scheduledDatetime: string;
//     deleteId?: number
// }