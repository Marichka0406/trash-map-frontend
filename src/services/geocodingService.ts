import axios from "axios";

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=uk`;
  const res = await axios.get(url);
  const feature = res.data.features?.[0];
  return feature?.place_name || "Невідома адреса";
};