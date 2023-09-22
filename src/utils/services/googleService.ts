import { ServiceError } from "../../utils/errors/service.error";
import { HttpStatusCode } from "../../router/RouterTypes";
import { LatLng } from "../../interfaces/LatLng";
import axios from "axios";
import urlencode from "urlencode";

const GOOGLE_API_ROUTE_URL = process.env.GOOGLE_API_ROUTE_URL!;
const GOOGLE_API_MAPS_URL = process.env.GOOGLE_API_MAPS_URL!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

export class Google {

    static getLocationFromAdrress = (address: string): Promise<LatLng> => {
        return new Promise(async (res, rej) => {
            try {
                const addressEncode = urlencode(address);
                const { data } = await axios.get(`${GOOGLE_API_MAPS_URL}/maps/api/geocode/json?address=${addressEncode}&key=${GOOGLE_API_KEY}`);

                switch (data.status) {
                    case "OK":
                        var location: LatLng = data.results[0].geometry.location;
                        return res(location);
                    case "ZERO_RESULTS": 
                        return rej(new ServiceError("Direccion incorrecta.", HttpStatusCode.INTERNAL_SERVER_ERROR));
                    default:
                        throw new Error();
                }
            } catch (err) {
                rej(new ServiceError("No se pudo obtener la ubicacion.", HttpStatusCode.INTERNAL_SERVER_ERROR));
            }
        });
    }

}

