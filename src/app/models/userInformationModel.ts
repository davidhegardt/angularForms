export class UserInformationModel {
    firstName : string;
    lastName : string;
    address : UserAddress;
    country : string;
}

export class UserAddress {
    street: string;
    zipcode: string;
    city: string;
}