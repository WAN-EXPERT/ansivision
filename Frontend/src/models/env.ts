export default class Env {
    _id: string;
    id: string;
    EMAIL : boolean;
    ICMP : boolean;
    TCP : boolean;

    constructor(
        _id: string = '',
        id: string = '',
        EMAIL : boolean = false,
        ICMP : boolean = false,
        TCP : boolean = false

    )

    {
        this._id = _id;
        this.id = id;
        this.EMAIL = EMAIL;
        this.ICMP = ICMP;
        this.TCP = TCP;

    }

}