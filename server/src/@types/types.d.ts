interface ILoginArgs {
    username: string;
    password: string;
}

interface IRegisterArgs extends ILoginArgs {
    email: string;
}