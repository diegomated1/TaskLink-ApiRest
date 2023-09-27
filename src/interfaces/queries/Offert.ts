export interface UserOffertGet {
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

export interface OffertGet {
    id: number;
    created_date: Date;
    agended_date: Date;
    price: number;
    user_location: {
        x: number,
        y: number
    } | null
    user_provider_location: {
        x: number,
        y: number
    } | null
    service: {
        price: number;
        calification: number;
        category: string;
    }
    user_provider_service?: UserOffertGet
    user?: UserOffertGet
}
