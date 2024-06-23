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
}

// export class smsProviderTemplate{
//     recipients: [];
//     body: string;
//     sender: string;
//     scheduledDatetime: string;
//     deleteId?: number
// }