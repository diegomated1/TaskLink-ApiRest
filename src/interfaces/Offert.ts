interface Offert {
    id: number;
    created_date: Date;
    agended_date: Date;
    user_id: string;
    service_id: number;
    status_id: number;
    price: number;
    user_location: any;
    user_provider_location: any;
}