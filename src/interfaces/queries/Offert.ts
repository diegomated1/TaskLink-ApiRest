export interface OffertGet {
    id: number;
    created_date: Date;
    agended_date: Date;
    price: number;
    user_location: any;
    user_provider_location: any;
    service: {
        price: number;
        calification: number;
        category: string;
    }
    user_provider_service: {
        id: string;
        identification: string;
        fullname: string;
        email: string;
        avatar_url: string;
        phone: string;
        birthdate: Date;
        identification_type_id: string;
        identification_type: string;
        role_id: string;
        role: string;
    }
}
