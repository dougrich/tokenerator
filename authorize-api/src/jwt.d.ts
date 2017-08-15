export interface JWT {
    user: JWT.User;
}

export namespace JWT {
    export interface User {
        id: string;
        display: string;
        email: string;
        grants: string[];
    }
}