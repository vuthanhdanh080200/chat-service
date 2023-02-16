import { Socket } from "socket.io"

export type User = {
    username: string
    groupnames: string[]
}

export type Users = Record<string, User>

export type Group = {
    groupname: string
    usernames: string[]
}

export type Groups = Record<string, Group>

export type Message = {
    id: string
    messeage: string
    createdDate: string
    from: string
    to: string
}

export type Sockets = Record<string, Socket>

export type Func = (...args: any[]) => any