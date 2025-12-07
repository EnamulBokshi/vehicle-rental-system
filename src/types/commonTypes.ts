       
export type vehicleType = 'car' | 'bike' | 'van' | 'SUV'

export type TVehicle = {
    id: string | number;
    vehicle_name: string;
    type: vehicleType;
    registration_number: string;
    daily_rent_price: number;
    availability_status: 'available' | 'booked';
}



export type TUser = {
    id: string | number,
    name: string,
    email: string, 
    password: string,
    phone: string,
    role: 'admin' | 'customer'
}