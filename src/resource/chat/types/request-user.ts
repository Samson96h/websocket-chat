import { confidential } from "src/database/enums/confidetial.enum"

export interface IRequestUser {
    id: number
    name: string
    phone: string
    confidentiality?: confidential
    temp?: boolean
}