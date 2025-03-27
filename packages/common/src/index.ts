import {z} from "zod"

export const  createuserschema=z.object({
    username:z.string().min(6).max(8),
    password:z.string().min(5).max(8),
    name:z.string().min(6).max(8)

})

export const signinschema=z.object({
    username:z.string().min(6).max(8),
    password:z.string().min(5).max(8),
})

export const roomschema=z.object({
    roomname:z.string().min(5).max(8)
})