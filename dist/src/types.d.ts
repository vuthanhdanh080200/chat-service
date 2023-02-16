import { Socket } from "socket.io";
export declare type User = {
    username: string;
    groupnames: string[];
};
export declare type Users = Record<string, User>;
export declare type Group = {
    groupname: string;
    usernames: string[];
};
export declare type Groups = Record<string, Group>;
export declare type Message = {
    id: string;
    messeage: string;
    createdDate: string;
    from: string;
    to: string;
};
export declare type Sockets = Record<string, Socket>;
export declare type Func = (...args: any[]) => any;
