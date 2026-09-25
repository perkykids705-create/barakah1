import { LocationConfig } from '../types';

export interface CountryLocationData {
  country: string;
  code: string;
  defaultCity: string;
  cities: {
    city: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }[];
}

export const COUNTRIES_DATABASE: CountryLocationData[] = [
  {
    country: 'Saudi Arabia',
    code: 'SA',
    defaultCity: 'Makkah',
    cities: [
      { city: 'Makkah', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
      { city: 'Madinah', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
      { city: 'Riyadh', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
      { city: 'Jeddah', latitude: 21.4858, longitude: 39.1925, timezone: 'Asia/Riyadh' },
      { city: 'Dammam', latitude: 26.4207, longitude: 50.0888, timezone: 'Asia/Riyadh' },
      { city: 'Al Khobar', latitude: 26.2172, longitude: 50.1971, timezone: 'Asia/Riyadh' },
      { city: 'Taif', latitude: 21.2854, longitude: 40.4222, timezone: 'Asia/Riyadh' },
      { city: 'Tabuk', latitude: 28.3835, longitude: 36.5662, timezone: 'Asia/Riyadh' },
      { city: 'Buraidah', latitude: 26.3260, longitude: 43.9750, timezone: 'Asia/Riyadh' },
      { city: 'Abha', latitude: 18.2164, longitude: 42.5053, timezone: 'Asia/Riyadh' },
      { city: 'Jubail', latitude: 27.0046, longitude: 49.6460, timezone: 'Asia/Riyadh' },
      { city: 'Yanbu', latitude: 24.0895, longitude: 38.0618, timezone: 'Asia/Riyadh' },
      { city: 'Najran', latitude: 17.4924, longitude: 44.1277, timezone: 'Asia/Riyadh' },
      { city: 'Jizan', latitude: 16.8892, longitude: 42.5511, timezone: 'Asia/Riyadh' },
      { city: 'Hail', latitude: 27.5219, longitude: 41.6907, timezone: 'Asia/Riyadh' },
      { city: 'Al Ahsa', latitude: 25.3800, longitude: 49.5857, timezone: 'Asia/Riyadh' },
    ],
  },
  {
    country: 'Pakistan',
    code: 'PK',
    defaultCity: 'Karachi',
    cities: [
      { city: 'Karachi', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
      { city: 'Lahore', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi' },
      { city: 'Islamabad', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
      { city: 'Rawalpindi', latitude: 33.5651, longitude: 73.0169, timezone: 'Asia/Karachi' },
      { city: 'Faisalabad', latitude: 31.4504, longitude: 73.1350, timezone: 'Asia/Karachi' },
      { city: 'Multan', latitude: 30.1575, longitude: 71.5249, timezone: 'Asia/Karachi' },
      { city: 'Peshawar', latitude: 34.0151, longitude: 71.5249, timezone: 'Asia/Karachi' },
      { city: 'Quetta', latitude: 30.1798, longitude: 66.9750, timezone: 'Asia/Karachi' },
      { city: 'Sialkot', latitude: 32.4945, longitude: 74.5229, timezone: 'Asia/Karachi' },
      { city: 'Gujranwala', latitude: 32.1877, longitude: 74.1945, timezone: 'Asia/Karachi' },
      { city: 'Hyderabad', latitude: 25.3960, longitude: 68.3578, timezone: 'Asia/Karachi' },
      { city: 'Abbottabad', latitude: 34.1688, longitude: 73.2215, timezone: 'Asia/Karachi' },
      { city: 'Bahawalpur', latitude: 29.3544, longitude: 71.6911, timezone: 'Asia/Karachi' },
      { city: 'Sargodha', latitude: 32.0836, longitude: 72.6711, timezone: 'Asia/Karachi' },
      { city: 'Sukkur', latitude: 27.7052, longitude: 68.8574, timezone: 'Asia/Karachi' },
      { city: 'Larkana', latitude: 27.5570, longitude: 68.2028, timezone: 'Asia/Karachi' },
    ],
  },
  {
    country: 'India',
    code: 'IN',
    defaultCity: 'Delhi',
    cities: [
      { city: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
      { city: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
      { city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
      { city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
      { city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
      { city: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
      { city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
      { city: 'Lucknow', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
      { city: 'Srinagar', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
      { city: 'Kochi', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
      { city: 'Calicut (Kozhikode)', latitude: 11.2588, longitude: 75.7804, timezone: 'Asia/Kolkata' },
      { city: 'Patna', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' },
      { city: 'Bhopal', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
      { city: 'Jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
      { city: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
      { city: 'Surat', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
      { city: 'Aligarh', latitude: 27.8974, longitude: 78.0880, timezone: 'Asia/Kolkata' },
      { city: 'Agra', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' },
    ],
  },
  {
    country: 'Bangladesh',
    code: 'BD',
    defaultCity: 'Dhaka',
    cities: [
      { city: 'Dhaka', latitude: 23.8103, longitude: 90.4125, timezone: 'Asia/Dhaka' },
      { city: 'Chittagong', latitude: 22.3569, longitude: 91.7832, timezone: 'Asia/Dhaka' },
      { city: 'Sylhet', latitude: 24.8949, longitude: 91.8687, timezone: 'Asia/Dhaka' },
      { city: 'Rajshahi', latitude: 24.3636, longitude: 88.6241, timezone: 'Asia/Dhaka' },
      { city: 'Khulna', latitude: 22.8456, longitude: 89.5403, timezone: 'Asia/Dhaka' },
      { city: 'Barisal', latitude: 22.7010, longitude: 90.3535, timezone: 'Asia/Dhaka' },
      { city: 'Rangpur', latitude: 25.7439, longitude: 89.2752, timezone: 'Asia/Dhaka' },
      { city: 'Mymensingh', latitude: 24.7471, longitude: 90.4203, timezone: 'Asia/Dhaka' },
      { city: 'Comilla', latitude: 23.4607, longitude: 91.1809, timezone: 'Asia/Dhaka' },
      { city: 'Bogra', latitude: 24.8465, longitude: 89.3778, timezone: 'Asia/Dhaka' },
      { city: 'Cox\'s Bazar', latitude: 21.4272, longitude: 92.0058, timezone: 'Asia/Dhaka' },
      { city: 'Gazipur', latitude: 23.9999, longitude: 90.4203, timezone: 'Asia/Dhaka' },
      { city: 'Narayanganj', latitude: 23.6238, longitude: 90.5000, timezone: 'Asia/Dhaka' },
      { city: 'Jessore', latitude: 23.1664, longitude: 89.2078, timezone: 'Asia/Dhaka' },
    ],
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    defaultCity: 'London',
    cities: [
      { city: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
      { city: 'Birmingham', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London' },
      { city: 'Manchester', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
      { city: 'Leeds', latitude: 53.8008, longitude: -1.5491, timezone: 'Europe/London' },
      { city: 'Glasgow', latitude: 55.8642, longitude: -4.2518, timezone: 'Europe/London' },
      { city: 'Bradford', latitude: 53.7957, longitude: -1.7594, timezone: 'Europe/London' },
      { city: 'Leicester', latitude: 52.6369, longitude: -1.1398, timezone: 'Europe/London' },
      { city: 'Luton', latitude: 51.8787, longitude: -0.4200, timezone: 'Europe/London' },
      { city: 'Cardiff', latitude: 51.4816, longitude: -3.1791, timezone: 'Europe/London' },
      { city: 'Edinburgh', latitude: 55.9533, longitude: -3.1883, timezone: 'Europe/London' },
      { city: 'Bristol', latitude: 51.4545, longitude: -2.5879, timezone: 'Europe/London' },
      { city: 'Sheffield', latitude: 53.3811, longitude: -1.4701, timezone: 'Europe/London' },
      { city: 'Newcastle', latitude: 54.9783, longitude: -1.6178, timezone: 'Europe/London' },
      { city: 'Nottingham', latitude: 52.9548, longitude: -1.1581, timezone: 'Europe/London' },
      { city: 'Belfast', latitude: 54.5973, longitude: -5.9301, timezone: 'Europe/London' },
    ],
  },
  {
    country: 'United States',
    code: 'US',
    defaultCity: 'New York',
    cities: [
      { city: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
      { city: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
      { city: 'Chicago', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
      { city: 'Houston', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago' },
      { city: 'Dallas', latitude: 32.7767, longitude: -96.7970, timezone: 'America/Chicago' },
      { city: 'Philadelphia', latitude: 39.9526, longitude: -75.1652, timezone: 'America/New_York' },
      { city: 'Washington D.C.', latitude: 38.9072, longitude: -77.0369, timezone: 'America/New_York' },
      { city: 'Atlanta', latitude: 33.7490, longitude: -84.3880, timezone: 'America/New_York' },
      { city: 'Detroit / Dearborn', latitude: 42.3223, longitude: -83.1763, timezone: 'America/Detroit' },
      { city: 'San Francisco / Bay Area', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
      { city: 'Seattle', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles' },
      { city: 'Boston', latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York' },
      { city: 'Minneapolis', latitude: 44.9778, longitude: -93.2650, timezone: 'America/Chicago' },
      { city: 'Orlando', latitude: 28.5383, longitude: -81.3792, timezone: 'America/New_York' },
      { city: 'Phoenix', latitude: 33.4484, longitude: -112.0740, timezone: 'America/Phoenix' },
      { city: 'Miami', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
      { city: 'Austin', latitude: 30.2672, longitude: -97.7431, timezone: 'America/Chicago' },
    ],
  },
  {
    country: 'Canada',
    code: 'CA',
    defaultCity: 'Toronto',
    cities: [
      { city: 'Toronto', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
      { city: 'Mississauga', latitude: 43.5890, longitude: -79.6441, timezone: 'America/Toronto' },
      { city: 'Montreal', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto' },
      { city: 'Vancouver', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
      { city: 'Calgary', latitude: 51.0447, longitude: -114.0719, timezone: 'America/Edmonton' },
      { city: 'Edmonton', latitude: 53.5461, longitude: -113.4938, timezone: 'America/Edmonton' },
      { city: 'Ottawa', latitude: 45.4215, longitude: -75.6972, timezone: 'America/Toronto' },
      { city: 'Winnipeg', latitude: 49.8951, longitude: -97.1384, timezone: 'America/Winnipeg' },
      { city: 'Quebec City', latitude: 46.8139, longitude: -71.2080, timezone: 'America/Toronto' },
      { city: 'Halifax', latitude: 44.6488, longitude: -63.5752, timezone: 'America/Halifax' },
    ],
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    defaultCity: 'Dubai',
    cities: [
      { city: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
      { city: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
      { city: 'Sharjah', latitude: 25.3463, longitude: 55.4209, timezone: 'Asia/Dubai' },
      { city: 'Ajman', latitude: 25.4052, longitude: 55.5136, timezone: 'Asia/Dubai' },
      { city: 'Ras Al Khaimah', latitude: 25.7895, longitude: 55.9432, timezone: 'Asia/Dubai' },
      { city: 'Al Ain', latitude: 24.2075, longitude: 55.7447, timezone: 'Asia/Dubai' },
      { city: 'Fujairah', latitude: 25.1288, longitude: 56.3265, timezone: 'Asia/Dubai' },
      { city: 'Umm Al Quwain', latitude: 25.5647, longitude: 55.5552, timezone: 'Asia/Dubai' },
    ],
  },
  {
    country: 'Egypt',
    code: 'EG',
    defaultCity: 'Cairo',
    cities: [
      { city: 'Cairo', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
      { city: 'Alexandria', latitude: 31.2001, longitude: 29.9187, timezone: 'Africa/Cairo' },
      { city: 'Giza', latitude: 30.0131, longitude: 31.2089, timezone: 'Africa/Cairo' },
      { city: 'Port Said', latitude: 31.2653, longitude: 32.3019, timezone: 'Africa/Cairo' },
      { city: 'Suez', latitude: 29.9668, longitude: 32.5498, timezone: 'Africa/Cairo' },
      { city: 'Luxor', latitude: 25.6872, longitude: 32.6396, timezone: 'Africa/Cairo' },
      { city: 'Aswan', latitude: 24.0889, longitude: 32.8998, timezone: 'Africa/Cairo' },
      { city: 'Mansoura', latitude: 31.0409, longitude: 31.3785, timezone: 'Africa/Cairo' },
      { city: 'Tanta', latitude: 30.7865, longitude: 31.0004, timezone: 'Africa/Cairo' },
      { city: 'Asyut', latitude: 27.1783, longitude: 31.1859, timezone: 'Africa/Cairo' },
      { city: 'Ismailia', latitude: 30.5965, longitude: 32.2715, timezone: 'Africa/Cairo' },
    ],
  },
  {
    country: 'Turkey',
    code: 'TR',
    defaultCity: 'Istanbul',
    cities: [
      { city: 'Istanbul', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
      { city: 'Ankara', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul' },
      { city: 'Izmir', latitude: 38.4237, longitude: 27.1428, timezone: 'Europe/Istanbul' },
      { city: 'Bursa', latitude: 40.1885, longitude: 29.0610, timezone: 'Europe/Istanbul' },
      { city: 'Antalya', latitude: 36.8969, longitude: 30.7133, timezone: 'Europe/Istanbul' },
      { city: 'Adana', latitude: 37.0000, longitude: 35.3213, timezone: 'Europe/Istanbul' },
      { city: 'Konya', latitude: 37.8667, longitude: 32.4833, timezone: 'Europe/Istanbul' },
      { city: 'Gaziantep', latitude: 37.0662, longitude: 37.3833, timezone: 'Europe/Istanbul' },
      { city: 'Sanliurfa', latitude: 37.1674, longitude: 38.7955, timezone: 'Europe/Istanbul' },
      { city: 'Trabzon', latitude: 41.0027, longitude: 39.7168, timezone: 'Europe/Istanbul' },
      { city: 'Diyarbakir', latitude: 37.9144, longitude: 40.2306, timezone: 'Europe/Istanbul' },
    ],
  },
  {
    country: 'Indonesia',
    code: 'ID',
    defaultCity: 'Jakarta',
    cities: [
      { city: 'Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
      { city: 'Surabaya', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
      { city: 'Bandung', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
      { city: 'Medan', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
      { city: 'Semarang', latitude: -6.9667, longitude: 110.4167, timezone: 'Asia/Jakarta' },
      { city: 'Makassar', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
      { city: 'Palembang', latitude: -2.9909, longitude: 104.7566, timezone: 'Asia/Jakarta' },
      { city: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
      { city: 'Banda Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 'Asia/Jakarta' },
      { city: 'Denpasar', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
    ],
  },
  {
    country: 'Malaysia',
    code: 'MY',
    defaultCity: 'Kuala Lumpur',
    cities: [
      { city: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'George Town (Penang)', latitude: 5.4164, longitude: 100.3327, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Johor Bahru', latitude: 1.4927, longitude: 103.7414, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Shah Alam', latitude: 3.0738, longitude: 101.5183, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Kota Kinabalu', latitude: 5.9804, longitude: 116.0735, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Kuching', latitude: 1.5533, longitude: 110.3592, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Ipoh', latitude: 4.5975, longitude: 101.0901, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Melaka', latitude: 2.1896, longitude: 102.2501, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Petaling Jaya', latitude: 3.1073, longitude: 101.6067, timezone: 'Asia/Kuala_Lumpur' },
      { city: 'Kuantan', latitude: 3.8077, longitude: 103.3260, timezone: 'Asia/Kuala_Lumpur' },
    ],
  },
  {
    country: 'Qatar',
    code: 'QA',
    defaultCity: 'Doha',
    cities: [
      { city: 'Doha', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar' },
      { city: 'Al Rayyan', latitude: 25.2919, longitude: 51.4244, timezone: 'Asia/Qatar' },
      { city: 'Al Wakrah', latitude: 25.1768, longitude: 51.6048, timezone: 'Asia/Qatar' },
      { city: 'Al Khor', latitude: 25.6804, longitude: 51.5058, timezone: 'Asia/Qatar' },
      { city: 'Umm Salal', latitude: 25.4093, longitude: 51.4172, timezone: 'Asia/Qatar' },
    ],
  },
  {
    country: 'Kuwait',
    code: 'KW',
    defaultCity: 'Kuwait City',
    cities: [
      { city: 'Kuwait City', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait' },
      { city: 'Hawalli', latitude: 29.3328, longitude: 48.0282, timezone: 'Asia/Kuwait' },
      { city: 'Salmiya', latitude: 29.3344, longitude: 48.0772, timezone: 'Asia/Kuwait' },
      { city: 'Al Ahmadi', latitude: 29.0769, longitude: 48.0839, timezone: 'Asia/Kuwait' },
      { city: 'Al Farwaniyah', latitude: 29.2783, longitude: 47.9583, timezone: 'Asia/Kuwait' },
      { city: 'Jahra', latitude: 29.3375, longitude: 47.6581, timezone: 'Asia/Kuwait' },
    ],
  },
  {
    country: 'Oman',
    code: 'OM',
    defaultCity: 'Muscat',
    cities: [
      { city: 'Muscat', latitude: 23.5859, longitude: 58.4059, timezone: 'Asia/Muscat' },
      { city: 'Salalah', latitude: 17.0151, longitude: 54.0924, timezone: 'Asia/Muscat' },
      { city: 'Sohar', latitude: 24.3644, longitude: 56.7469, timezone: 'Asia/Muscat' },
      { city: 'Nizwa', latitude: 22.9333, longitude: 57.5333, timezone: 'Asia/Muscat' },
      { city: 'Sur', latitude: 22.5667, longitude: 59.5289, timezone: 'Asia/Muscat' },
      { city: 'Seeb', latitude: 23.6703, longitude: 58.1891, timezone: 'Asia/Muscat' },
    ],
  },
  {
    country: 'Bahrain',
    code: 'BH',
    defaultCity: 'Manama',
    cities: [
      { city: 'Manama', latitude: 26.2285, longitude: 50.5860, timezone: 'Asia/Bahrain' },
      { city: 'Riffa', latitude: 26.1300, longitude: 50.5550, timezone: 'Asia/Bahrain' },
      { city: 'Muharraq', latitude: 26.2572, longitude: 50.6119, timezone: 'Asia/Bahrain' },
      { city: 'Hamad Town', latitude: 26.1153, longitude: 50.5069, timezone: 'Asia/Bahrain' },
      { city: 'A\'ali', latitude: 26.1558, longitude: 50.5264, timezone: 'Asia/Bahrain' },
    ],
  },
  {
    country: 'Jordan',
    code: 'JO',
    defaultCity: 'Amman',
    cities: [
      { city: 'Amman', latitude: 31.9454, longitude: 35.9284, timezone: 'Asia/Amman' },
      { city: 'Zarqa', latitude: 32.0728, longitude: 36.0880, timezone: 'Asia/Amman' },
      { city: 'Irbid', latitude: 32.5568, longitude: 35.8469, timezone: 'Asia/Amman' },
      { city: 'Aqaba', latitude: 29.5320, longitude: 35.0063, timezone: 'Asia/Amman' },
      { city: 'Madaba', latitude: 31.7196, longitude: 35.7941, timezone: 'Asia/Amman' },
      { city: 'Salt', latitude: 32.0392, longitude: 35.7272, timezone: 'Asia/Amman' },
    ],
  },
  {
    country: 'Palestine',
    code: 'PS',
    defaultCity: 'Jerusalem',
    cities: [
      { city: 'Jerusalem (Al-Quds)', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Jerusalem' },
      { city: 'Gaza', latitude: 31.5017, longitude: 34.4668, timezone: 'Asia/Gaza' },
      { city: 'Ramallah', latitude: 31.9038, longitude: 35.2034, timezone: 'Asia/Hebron' },
      { city: 'Hebron (Al-Khalil)', latitude: 31.5326, longitude: 35.0998, timezone: 'Asia/Hebron' },
      { city: 'Nablus', latitude: 32.2211, longitude: 35.2544, timezone: 'Asia/Hebron' },
      { city: 'Bethlehem', latitude: 31.7054, longitude: 35.2024, timezone: 'Asia/Hebron' },
      { city: 'Jenin', latitude: 32.4637, longitude: 35.2951, timezone: 'Asia/Hebron' },
    ],
  },
  {
    country: 'Morocco',
    code: 'MA',
    defaultCity: 'Casablanca',
    cities: [
      { city: 'Casablanca', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
      { city: 'Rabat', latitude: 34.0209, longitude: -6.8416, timezone: 'Africa/Casablanca' },
      { city: 'Fes', latitude: 34.0181, longitude: -5.0078, timezone: 'Africa/Casablanca' },
      { city: 'Marrakech', latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca' },
      { city: 'Tangier', latitude: 35.7595, longitude: -5.8340, timezone: 'Africa/Casablanca' },
      { city: 'Agadir', latitude: 30.4278, longitude: -9.5981, timezone: 'Africa/Casablanca' },
      { city: 'Meknes', latitude: 33.8938, longitude: -5.5516, timezone: 'Africa/Casablanca' },
      { city: 'Oujda', latitude: 34.6867, longitude: -1.9114, timezone: 'Africa/Casablanca' },
      { city: 'Tetouan', latitude: 35.5889, longitude: -5.3626, timezone: 'Africa/Casablanca' },
    ],
  },
  {
    country: 'Algeria',
    code: 'DZ',
    defaultCity: 'Algiers',
    cities: [
      { city: 'Algiers', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers' },
      { city: 'Oran', latitude: 35.6987, longitude: -0.6349, timezone: 'Africa/Algiers' },
      { city: 'Constantine', latitude: 36.3650, longitude: 6.6147, timezone: 'Africa/Algiers' },
      { city: 'Annaba', latitude: 36.9000, longitude: 7.7667, timezone: 'Africa/Algiers' },
      { city: 'Blida', latitude: 36.4700, longitude: 2.8300, timezone: 'Africa/Algiers' },
      { city: 'Batna', latitude: 35.5559, longitude: 6.1741, timezone: 'Africa/Algiers' },
      { city: 'Setif', latitude: 36.1911, longitude: 5.4137, timezone: 'Africa/Algiers' },
      { city: 'Tlemcen', latitude: 34.8783, longitude: -1.3150, timezone: 'Africa/Algiers' },
    ],
  },
  {
    country: 'Tunisia',
    code: 'TN',
    defaultCity: 'Tunis',
    cities: [
      { city: 'Tunis', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis' },
      { city: 'Sfax', latitude: 34.7406, longitude: 10.7603, timezone: 'Africa/Tunis' },
      { city: 'Sousse', latitude: 35.8256, longitude: 10.6084, timezone: 'Africa/Tunis' },
      { city: 'Kairouan', latitude: 35.6781, longitude: 10.0963, timezone: 'Africa/Tunis' },
      { city: 'Bizerte', latitude: 37.2744, longitude: 9.8739, timezone: 'Africa/Tunis' },
      { city: 'Gabes', latitude: 33.8815, longitude: 10.0982, timezone: 'Africa/Tunis' },
    ],
  },
  {
    country: 'Nigeria',
    code: 'NG',
    defaultCity: 'Lagos',
    cities: [
      { city: 'Lagos', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos' },
      { city: 'Kano', latitude: 12.0022, longitude: 8.5920, timezone: 'Africa/Lagos' },
      { city: 'Abuja', latitude: 9.0765, longitude: 7.3986, timezone: 'Africa/Lagos' },
      { city: 'Ibadan', latitude: 7.3775, longitude: 3.9470, timezone: 'Africa/Lagos' },
      { city: 'Kaduna', latitude: 10.5105, longitude: 7.4165, timezone: 'Africa/Lagos' },
      { city: 'Ilorin', latitude: 8.4966, longitude: 4.5421, timezone: 'Africa/Lagos' },
      { city: 'Zaria', latitude: 11.0855, longitude: 7.7199, timezone: 'Africa/Lagos' },
      { city: 'Sokoto', latitude: 13.0059, longitude: 5.2476, timezone: 'Africa/Lagos' },
      { city: 'Maiduguri', latitude: 11.8311, longitude: 13.1510, timezone: 'Africa/Lagos' },
    ],
  },
  {
    country: 'South Africa',
    code: 'ZA',
    defaultCity: 'Johannesburg',
    cities: [
      { city: 'Johannesburg', latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg' },
      { city: 'Cape Town', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
      { city: 'Durban', latitude: -29.8587, longitude: 31.0218, timezone: 'Africa/Johannesburg' },
      { city: 'Pretoria', latitude: -25.7479, longitude: 28.2293, timezone: 'Africa/Johannesburg' },
      { city: 'Port Elizabeth (Gqeberha)', latitude: -33.9608, longitude: 25.6022, timezone: 'Africa/Johannesburg' },
    ],
  },
  {
    country: 'Australia',
    code: 'AU',
    defaultCity: 'Sydney',
    cities: [
      { city: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
      { city: 'Melbourne', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
      { city: 'Brisbane', latitude: -27.4698, longitude: 153.0251, timezone: 'Australia/Brisbane' },
      { city: 'Perth', latitude: -31.9505, longitude: 115.8605, timezone: 'Australia/Perth' },
      { city: 'Adelaide', latitude: -34.9285, longitude: 138.6007, timezone: 'Australia/Adelaide' },
      { city: 'Canberra', latitude: -35.2809, longitude: 149.1300, timezone: 'Australia/Sydney' },
      { city: 'Gold Coast', latitude: -28.0167, longitude: 153.4000, timezone: 'Australia/Brisbane' },
    ],
  },
  {
    country: 'Germany',
    code: 'DE',
    defaultCity: 'Berlin',
    cities: [
      { city: 'Berlin', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
      { city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, timezone: 'Europe/Berlin' },
      { city: 'Munich', latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin' },
      { city: 'Cologne', latitude: 50.9375, longitude: 6.9603, timezone: 'Europe/Berlin' },
      { city: 'Hamburg', latitude: 53.5511, longitude: 9.9937, timezone: 'Europe/Berlin' },
      { city: 'Stuttgart', latitude: 48.7758, longitude: 9.1829, timezone: 'Europe/Berlin' },
      { city: 'Dusseldorf', latitude: 51.2277, longitude: 6.7735, timezone: 'Europe/Berlin' },
      { city: 'Dortmund', latitude: 51.5136, longitude: 7.4653, timezone: 'Europe/Berlin' },
      { city: 'Essen', latitude: 51.4556, longitude: 7.0116, timezone: 'Europe/Berlin' },
    ],
  },
  {
    country: 'France',
    code: 'FR',
    defaultCity: 'Paris',
    cities: [
      { city: 'Paris', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
      { city: 'Marseille', latitude: 43.2965, longitude: 5.3698, timezone: 'Europe/Paris' },
      { city: 'Lyon', latitude: 45.7640, longitude: 4.8357, timezone: 'Europe/Paris' },
      { city: 'Toulouse', latitude: 43.6047, longitude: 1.4442, timezone: 'Europe/Paris' },
      { city: 'Nice', latitude: 43.7102, longitude: 7.2620, timezone: 'Europe/Paris' },
      { city: 'Strasbourg', latitude: 48.5734, longitude: 7.7521, timezone: 'Europe/Paris' },
      { city: 'Bordeaux', latitude: 44.8378, longitude: -0.5792, timezone: 'Europe/Paris' },
      { city: 'Lille', latitude: 50.6292, longitude: 3.0573, timezone: 'Europe/Paris' },
    ],
  },
  {
    country: 'Singapore',
    code: 'SG',
    defaultCity: 'Singapore',
    cities: [
      { city: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
    ],
  },
  {
    country: 'New Zealand',
    code: 'NZ',
    defaultCity: 'Auckland',
    cities: [
      { city: 'Auckland', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland' },
      { city: 'Wellington', latitude: -41.2865, longitude: 174.7762, timezone: 'Pacific/Auckland' },
      { city: 'Christchurch', latitude: -43.5321, longitude: 172.6362, timezone: 'Pacific/Auckland' },
      { city: 'Hamilton', latitude: -37.7870, longitude: 175.2793, timezone: 'Pacific/Auckland' },
    ],
  },
  {
    country: 'Netherlands',
    code: 'NL',
    defaultCity: 'Amsterdam',
    cities: [
      { city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
      { city: 'Rotterdam', latitude: 51.9244, longitude: 4.4777, timezone: 'Europe/Amsterdam' },
      { city: 'The Hague', latitude: 52.0705, longitude: 4.3007, timezone: 'Europe/Amsterdam' },
      { city: 'Utrecht', latitude: 52.0907, longitude: 5.1214, timezone: 'Europe/Amsterdam' },
      { city: 'Eindhoven', latitude: 51.4416, longitude: 5.4697, timezone: 'Europe/Amsterdam' },
    ],
  },
  {
    country: 'Spain',
    code: 'ES',
    defaultCity: 'Madrid',
    cities: [
      { city: 'Madrid', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
      { city: 'Barcelona', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid' },
      { city: 'Valencia', latitude: 39.4699, longitude: -0.3763, timezone: 'Europe/Madrid' },
      { city: 'Seville', latitude: 37.3891, longitude: -5.9845, timezone: 'Europe/Madrid' },
      { city: 'Granada', latitude: 37.1773, longitude: -3.5986, timezone: 'Europe/Madrid' },
      { city: 'Cordoba', latitude: 37.8882, longitude: -4.7794, timezone: 'Europe/Madrid' },
      { city: 'Ceuta', latitude: 35.8894, longitude: -5.3198, timezone: 'Africa/Ceuta' },
      { city: 'Melilla', latitude: 35.2923, longitude: -2.9381, timezone: 'Africa/Ceuta' },
    ],
  },
  {
    country: 'Italy',
    code: 'IT',
    defaultCity: 'Rome',
    cities: [
      { city: 'Rome', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome' },
      { city: 'Milan', latitude: 45.4642, longitude: 9.1900, timezone: 'Europe/Rome' },
      { city: 'Naples', latitude: 40.8518, longitude: 14.2681, timezone: 'Europe/Rome' },
      { city: 'Turin', latitude: 45.0703, longitude: 7.6869, timezone: 'Europe/Rome' },
      { city: 'Florence', latitude: 43.7696, longitude: 11.2558, timezone: 'Europe/Rome' },
    ],
  },
  {
    country: 'Kenya',
    code: 'KE',
    defaultCity: 'Nairobi',
    cities: [
      { city: 'Nairobi', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi' },
      { city: 'Mombasa', latitude: -4.0435, longitude: 39.6682, timezone: 'Africa/Nairobi' },
      { city: 'Kisumu', latitude: -0.0917, longitude: 34.7680, timezone: 'Africa/Nairobi' },
      { city: 'Garissa', latitude: -0.4532, longitude: 39.6460, timezone: 'Africa/Nairobi' },
    ],
  },
  {
    country: 'Somalia',
    code: 'SO',
    defaultCity: 'Mogadishu',
    cities: [
      { city: 'Mogadishu', latitude: 2.0469, longitude: 45.3182, timezone: 'Africa/Mogadishu' },
      { city: 'Hargeisa', latitude: 9.5600, longitude: 44.0650, timezone: 'Africa/Mogadishu' },
      { city: 'Bosaso', latitude: 11.2842, longitude: 49.1816, timezone: 'Africa/Mogadishu' },
      { city: 'Kismayo', latitude: -0.3582, longitude: 42.5454, timezone: 'Africa/Mogadishu' },
      { city: 'Berbera', latitude: 10.4396, longitude: 45.0143, timezone: 'Africa/Mogadishu' },
    ],
  },
  {
    country: 'Sudan',
    code: 'SD',
    defaultCity: 'Khartoum',
    cities: [
      { city: 'Khartoum', latitude: 15.5007, longitude: 32.5599, timezone: 'Africa/Khartoum' },
      { city: 'Omdurman', latitude: 15.6445, longitude: 32.4777, timezone: 'Africa/Khartoum' },
      { city: 'Port Sudan', latitude: 19.6175, longitude: 37.2164, timezone: 'Africa/Khartoum' },
      { city: 'Kassala', latitude: 15.4510, longitude: 36.4000, timezone: 'Africa/Khartoum' },
    ],
  },
  {
    country: 'Yemen',
    code: 'YE',
    defaultCity: 'Sana\'a',
    cities: [
      { city: 'Sana\'a', latitude: 15.3694, longitude: 44.1910, timezone: 'Asia/Aden' },
      { city: 'Aden', latitude: 12.7855, longitude: 45.0187, timezone: 'Asia/Aden' },
      { city: 'Taiz', latitude: 13.5789, longitude: 44.0219, timezone: 'Asia/Aden' },
      { city: 'Al Hudaydah', latitude: 14.7978, longitude: 42.9545, timezone: 'Asia/Aden' },
      { city: 'Mukalla', latitude: 14.5425, longitude: 49.1242, timezone: 'Asia/Aden' },
    ],
  },
  {
    country: 'Sri Lanka',
    code: 'LK',
    defaultCity: 'Colombo',
    cities: [
      { city: 'Colombo', latitude: 6.9271, longitude: 79.8612, timezone: 'Asia/Colombo' },
      { city: 'Kandy', latitude: 7.2906, longitude: 80.6337, timezone: 'Asia/Colombo' },
      { city: 'Galle', latitude: 6.0535, longitude: 80.2210, timezone: 'Asia/Colombo' },
      { city: 'Jaffna', latitude: 9.6615, longitude: 80.0255, timezone: 'Asia/Colombo' },
      { city: 'Batticaloa', latitude: 7.7170, longitude: 81.7000, timezone: 'Asia/Colombo' },
    ],
  },
  {
    country: 'Japan',
    code: 'JP',
    defaultCity: 'Tokyo',
    cities: [
      { city: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
      { city: 'Osaka', latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo' },
      { city: 'Nagoya', latitude: 35.1815, longitude: 136.9066, timezone: 'Asia/Tokyo' },
      { city: 'Kyoto', latitude: 35.0116, longitude: 135.7681, timezone: 'Asia/Tokyo' },
      { city: 'Fukuoka', latitude: 33.5904, longitude: 130.4017, timezone: 'Asia/Tokyo' },
      { city: 'Sapporo', latitude: 43.0618, longitude: 141.3545, timezone: 'Asia/Tokyo' },
    ],
  },
  {
    country: 'South Korea',
    code: 'KR',
    defaultCity: 'Seoul',
    cities: [
      { city: 'Seoul', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul' },
      { city: 'Busan', latitude: 35.1796, longitude: 129.0756, timezone: 'Asia/Seoul' },
      { city: 'Incheon', latitude: 37.4563, longitude: 126.7052, timezone: 'Asia/Seoul' },
      { city: 'Daegu', latitude: 35.8714, longitude: 128.6014, timezone: 'Asia/Seoul' },
    ],
  },
  {
    country: 'China',
    code: 'CN',
    defaultCity: 'Beijing',
    cities: [
      { city: 'Beijing', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai' },
      { city: 'Shanghai', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai' },
      { city: 'Guangzhou', latitude: 23.1291, longitude: 113.2644, timezone: 'Asia/Shanghai' },
      { city: 'Shenzhen', latitude: 22.5431, longitude: 114.0579, timezone: 'Asia/Shanghai' },
      { city: 'Xi\'an', latitude: 34.3416, longitude: 108.9398, timezone: 'Asia/Shanghai' },
      { city: 'Urumqi', latitude: 43.8256, longitude: 87.6168, timezone: 'Asia/Urumqi' },
      { city: 'Yiwu', latitude: 29.3151, longitude: 120.0768, timezone: 'Asia/Shanghai' },
      { city: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong' },
    ],
  },
  {
    country: 'Russia',
    code: 'RU',
    defaultCity: 'Moscow',
    cities: [
      { city: 'Moscow', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
      { city: 'Saint Petersburg', latitude: 59.9343, longitude: 30.3351, timezone: 'Europe/Moscow' },
      { city: 'Kazan', latitude: 55.8304, longitude: 49.0661, timezone: 'Europe/Moscow' },
      { city: 'Ufa', latitude: 54.7388, longitude: 55.9721, timezone: 'Asia/Yekaterinburg' },
      { city: 'Makhachkala', latitude: 42.9849, longitude: 47.5047, timezone: 'Europe/Moscow' },
      { city: 'Grozny', latitude: 43.3170, longitude: 45.6987, timezone: 'Europe/Moscow' },
    ],
  },
  {
    country: 'Philippines',
    code: 'PH',
    defaultCity: 'Manila',
    cities: [
      { city: 'Manila', latitude: 14.5995, longitude: 120.9842, timezone: 'Asia/Manila' },
      { city: 'Davao City', latitude: 7.1907, longitude: 125.4553, timezone: 'Asia/Manila' },
      { city: 'Zamboanga City', latitude: 6.9214, longitude: 122.0790, timezone: 'Asia/Manila' },
      { city: 'Cotabato City', latitude: 7.2236, longitude: 124.2464, timezone: 'Asia/Manila' },
      { city: 'Marawi', latitude: 8.0034, longitude: 124.2847, timezone: 'Asia/Manila' },
    ],
  },
  {
    country: 'Thailand',
    code: 'TH',
    defaultCity: 'Bangkok',
    cities: [
      { city: 'Bangkok', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
      { city: 'Chiang Mai', latitude: 18.7883, longitude: 98.9853, timezone: 'Asia/Bangkok' },
      { city: 'Phuket', latitude: 7.8804, longitude: 98.3923, timezone: 'Asia/Bangkok' },
      { city: 'Hat Yai', latitude: 7.0084, longitude: 100.4767, timezone: 'Asia/Bangkok' },
      { city: 'Pattani', latitude: 6.8672, longitude: 101.2501, timezone: 'Asia/Bangkok' },
      { city: 'Yala', latitude: 6.5411, longitude: 101.2804, timezone: 'Asia/Bangkok' },
    ],
  },
  {
    country: 'Brazil',
    code: 'BR',
    defaultCity: 'São Paulo',
    cities: [
      { city: 'São Paulo', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
      { city: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
      { city: 'Brasília', latitude: -15.8267, longitude: -47.9218, timezone: 'America/Sao_Paulo' },
      { city: 'Curitiba', latitude: -25.4290, longitude: -49.2671, timezone: 'America/Sao_Paulo' },
      { city: 'Foz do Iguaçu', latitude: -25.5163, longitude: -54.5854, timezone: 'America/Sao_Paulo' },
    ],
  },
  {
    country: 'Uzbekistan',
    code: 'UZ',
    defaultCity: 'Tashkent',
    cities: [
      { city: 'Tashkent', latitude: 41.2995, longitude: 69.2401, timezone: 'Asia/Tashkent' },
      { city: 'Samarkand', latitude: 39.6270, longitude: 66.9750, timezone: 'Asia/Tashkent' },
      { city: 'Bukhara', latitude: 39.7681, longitude: 64.4556, timezone: 'Asia/Tashkent' },
      { city: 'Khiva', latitude: 41.3783, longitude: 60.3639, timezone: 'Asia/Tashkent' },
      { city: 'Andijan', latitude: 40.7821, longitude: 72.3442, timezone: 'Asia/Tashkent' },
      { city: 'Namangan', latitude: 40.9983, longitude: 71.6726, timezone: 'Asia/Tashkent' },
    ],
  },
  {
    country: 'Afghanistan',
    code: 'AF',
    defaultCity: 'Kabul',
    cities: [
      { city: 'Kabul', latitude: 34.5553, longitude: 69.2075, timezone: 'Asia/Kabul' },
      { city: 'Herat', latitude: 34.3529, longitude: 62.2040, timezone: 'Asia/Kabul' },
      { city: 'Kandahar', latitude: 31.6289, longitude: 65.7372, timezone: 'Asia/Kabul' },
      { city: 'Mazar-i-Sharif', latitude: 36.7153, longitude: 67.1107, timezone: 'Asia/Kabul' },
      { city: 'Jalalabad', latitude: 34.4265, longitude: 70.4515, timezone: 'Asia/Kabul' },
    ],
  },
  {
    country: 'Albania',
    code: 'AL',
    defaultCity: 'Tirana',
    cities: [
      { city: 'Tirana', latitude: 41.3275, longitude: 19.8187, timezone: 'Europe/Tirane' },
      { city: 'Durres', latitude: 41.3230, longitude: 19.4414, timezone: 'Europe/Tirane' },
      { city: 'Shkoder', latitude: 42.0683, longitude: 19.5126, timezone: 'Europe/Tirane' },
      { city: 'Vlore', latitude: 40.4667, longitude: 19.4897, timezone: 'Europe/Tirane' },
    ],
  },
  {
    country: 'Azerbaijan',
    code: 'AZ',
    defaultCity: 'Baku',
    cities: [
      { city: 'Baku', latitude: 40.4093, longitude: 49.8671, timezone: 'Asia/Baku' },
      { city: 'Ganja', latitude: 40.6828, longitude: 46.3606, timezone: 'Asia/Baku' },
      { city: 'Sumqayit', latitude: 40.5897, longitude: 49.6686, timezone: 'Asia/Baku' },
      { city: 'Lankaran', latitude: 38.7529, longitude: 48.8475, timezone: 'Asia/Baku' },
    ],
  },
  {
    country: 'Belgium',
    code: 'BE',
    defaultCity: 'Brussels',
    cities: [
      { city: 'Brussels', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels' },
      { city: 'Antwerp', latitude: 51.2194, longitude: 4.4025, timezone: 'Europe/Brussels' },
      { city: 'Ghent', latitude: 51.0543, longitude: 3.7174, timezone: 'Europe/Brussels' },
      { city: 'Liege', latitude: 50.6326, longitude: 5.5797, timezone: 'Europe/Brussels' },
    ],
  },
  {
    country: 'Bosnia and Herzegovina',
    code: 'BA',
    defaultCity: 'Sarajevo',
    cities: [
      { city: 'Sarajevo', latitude: 43.8563, longitude: 18.4131, timezone: 'Europe/Sarajevo' },
      { city: 'Mostar', latitude: 43.3438, longitude: 17.8078, timezone: 'Europe/Sarajevo' },
      { city: 'Tuzla', latitude: 44.5384, longitude: 18.6671, timezone: 'Europe/Sarajevo' },
      { city: 'Zenica', latitude: 44.2034, longitude: 17.9077, timezone: 'Europe/Sarajevo' },
    ],
  },
  {
    country: 'Brunei',
    code: 'BN',
    defaultCity: 'Bandar Seri Begawan',
    cities: [
      { city: 'Bandar Seri Begawan', latitude: 4.9031, longitude: 114.9398, timezone: 'Asia/Brunei' },
      { city: 'Kuala Belait', latitude: 4.5836, longitude: 114.2312, timezone: 'Asia/Brunei' },
    ],
  },
  {
    country: 'Denmark',
    code: 'DK',
    defaultCity: 'Copenhagen',
    cities: [
      { city: 'Copenhagen', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen' },
      { city: 'Aarhus', latitude: 56.1629, longitude: 10.2039, timezone: 'Europe/Copenhagen' },
      { city: 'Odense', latitude: 55.4038, longitude: 10.4024, timezone: 'Europe/Copenhagen' },
    ],
  },
  {
    country: 'Ethiopia',
    code: 'ET',
    defaultCity: 'Addis Ababa',
    cities: [
      { city: 'Addis Ababa', latitude: 9.0300, longitude: 38.7400, timezone: 'Africa/Addis_Ababa' },
      { city: 'Dire Dawa', latitude: 9.5931, longitude: 41.8661, timezone: 'Africa/Addis_Ababa' },
      { city: 'Harar', latitude: 9.3139, longitude: 42.1182, timezone: 'Africa/Addis_Ababa' },
    ],
  },
  {
    country: 'Ghana',
    code: 'GH',
    defaultCity: 'Accra',
    cities: [
      { city: 'Accra', latitude: 5.6037, longitude: -0.1870, timezone: 'Africa/Accra' },
      { city: 'Kumasi', latitude: 6.6885, longitude: -1.6244, timezone: 'Africa/Accra' },
      { city: 'Tamale', latitude: 9.4008, longitude: -0.8393, timezone: 'Africa/Accra' },
    ],
  },
  {
    country: 'Iran',
    code: 'IR',
    defaultCity: 'Tehran',
    cities: [
      { city: 'Tehran', latitude: 35.6892, longitude: 51.3890, timezone: 'Asia/Tehran' },
      { city: 'Mashhad', latitude: 36.2605, longitude: 59.6168, timezone: 'Asia/Tehran' },
      { city: 'Isfahan', latitude: 32.6546, longitude: 51.6680, timezone: 'Asia/Tehran' },
      { city: 'Shiraz', latitude: 29.5918, longitude: 52.5837, timezone: 'Asia/Tehran' },
      { city: 'Tabriz', latitude: 38.0962, longitude: 46.2738, timezone: 'Asia/Tehran' },
      { city: 'Qom', latitude: 34.6401, longitude: 50.8764, timezone: 'Asia/Tehran' },
    ],
  },
  {
    country: 'Iraq',
    code: 'IQ',
    defaultCity: 'Baghdad',
    cities: [
      { city: 'Baghdad', latitude: 33.3152, longitude: 44.3661, timezone: 'Asia/Baghdad' },
      { city: 'Basra', latitude: 30.5081, longitude: 47.7835, timezone: 'Asia/Baghdad' },
      { city: 'Erbil', latitude: 36.1901, longitude: 44.0091, timezone: 'Asia/Baghdad' },
      { city: 'Mosul', latitude: 36.3400, longitude: 43.1300, timezone: 'Asia/Baghdad' },
      { city: 'Najaf', latitude: 31.9961, longitude: 44.3314, timezone: 'Asia/Baghdad' },
      { city: 'Karbala', latitude: 32.6160, longitude: 44.0249, timezone: 'Asia/Baghdad' },
    ],
  },
  {
    country: 'Kazakhstan',
    code: 'KZ',
    defaultCity: 'Almaty',
    cities: [
      { city: 'Almaty', latitude: 43.2220, longitude: 76.8512, timezone: 'Asia/Almaty' },
      { city: 'Astana', latitude: 51.1694, longitude: 71.4491, timezone: 'Asia/Almaty' },
      { city: 'Shymkent', latitude: 42.3417, longitude: 69.5901, timezone: 'Asia/Almaty' },
    ],
  },
  {
    country: 'Kyrgyzstan',
    code: 'KG',
    defaultCity: 'Bishkek',
    cities: [
      { city: 'Bishkek', latitude: 42.8746, longitude: 74.5698, timezone: 'Asia/Bishkek' },
      { city: 'Osh', latitude: 40.5140, longitude: 72.8161, timezone: 'Asia/Bishkek' },
      { city: 'Jalal-Abad', latitude: 40.9333, longitude: 72.9833, timezone: 'Asia/Bishkek' },
    ],
  },
  {
    country: 'Lebanon',
    code: 'LB',
    defaultCity: 'Beirut',
    cities: [
      { city: 'Beirut', latitude: 33.8938, longitude: 35.5018, timezone: 'Asia/Beirut' },
      { city: 'Tripoli', latitude: 34.4367, longitude: 35.8497, timezone: 'Asia/Beirut' },
      { city: 'Sidon', latitude: 33.5599, longitude: 35.3756, timezone: 'Asia/Beirut' },
      { city: 'Tyre', latitude: 33.2733, longitude: 35.1939, timezone: 'Asia/Beirut' },
    ],
  },
  {
    country: 'Libya',
    code: 'LY',
    defaultCity: 'Tripoli',
    cities: [
      { city: 'Tripoli', latitude: 32.8872, longitude: 13.1913, timezone: 'Africa/Tripoli' },
      { city: 'Benghazi', latitude: 32.1167, longitude: 20.0667, timezone: 'Africa/Tripoli' },
      { city: 'Misrata', latitude: 32.3754, longitude: 15.0925, timezone: 'Africa/Tripoli' },
    ],
  },
  {
    country: 'Maldives',
    code: 'MV',
    defaultCity: 'Male',
    cities: [
      { city: 'Male', latitude: 4.1755, longitude: 73.5093, timezone: 'Indian/Maldives' },
      { city: 'Addu City', latitude: -0.6300, longitude: 73.1583, timezone: 'Indian/Maldives' },
    ],
  },
  {
    country: 'Mali',
    code: 'ML',
    defaultCity: 'Bamako',
    cities: [
      { city: 'Bamako', latitude: 12.6392, longitude: -8.0029, timezone: 'Africa/Bamako' },
      { city: 'Timbuktu', latitude: 16.7666, longitude: -3.0026, timezone: 'Africa/Bamako' },
    ],
  },
  {
    country: 'Mauritania',
    code: 'MR',
    defaultCity: 'Nouakchott',
    cities: [
      { city: 'Nouakchott', latitude: 18.0735, longitude: -15.9582, timezone: 'Africa/Nouakchott' },
      { city: 'Nouadhibou', latitude: 20.9442, longitude: -17.0360, timezone: 'Africa/Nouakchott' },
    ],
  },
  {
    country: 'Mauritius',
    code: 'MU',
    defaultCity: 'Port Louis',
    cities: [
      { city: 'Port Louis', latitude: -20.1609, longitude: 57.5012, timezone: 'Indian/Mauritius' },
    ],
  },
  {
    country: 'Nepal',
    code: 'NP',
    defaultCity: 'Kathmandu',
    cities: [
      { city: 'Kathmandu', latitude: 27.7172, longitude: 85.3240, timezone: 'Asia/Kathmandu' },
      { city: 'Pokhara', latitude: 28.2096, longitude: 83.9856, timezone: 'Asia/Kathmandu' },
    ],
  },
  {
    country: 'Norway',
    code: 'NO',
    defaultCity: 'Oslo',
    cities: [
      { city: 'Oslo', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo' },
      { city: 'Bergen', latitude: 60.3913, longitude: 5.3221, timezone: 'Europe/Oslo' },
      { city: 'Trondheim', latitude: 63.4305, longitude: 10.3951, timezone: 'Europe/Oslo' },
      { city: 'Stavanger', latitude: 58.9700, longitude: 5.7331, timezone: 'Europe/Oslo' },
      { city: 'Tromso', latitude: 69.6492, longitude: 18.9553, timezone: 'Europe/Oslo' },
    ],
  },
  {
    country: 'Senegal',
    code: 'SN',
    defaultCity: 'Dakar',
    cities: [
      { city: 'Dakar', latitude: 14.7167, longitude: -17.4677, timezone: 'Africa/Dakar' },
      { city: 'Touba', latitude: 14.8667, longitude: -15.8833, timezone: 'Africa/Dakar' },
      { city: 'Thies', latitude: 14.7833, longitude: -16.9333, timezone: 'Africa/Dakar' },
    ],
  },
  {
    country: 'Sweden',
    code: 'SE',
    defaultCity: 'Stockholm',
    cities: [
      { city: 'Stockholm', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm' },
      { city: 'Gothenburg', latitude: 57.7089, longitude: 11.9746, timezone: 'Europe/Stockholm' },
      { city: 'Malmo', latitude: 55.6050, longitude: 13.0038, timezone: 'Europe/Stockholm' },
      { city: 'Uppsala', latitude: 59.8586, longitude: 17.6389, timezone: 'Europe/Stockholm' },
    ],
  },
  {
    country: 'Switzerland',
    code: 'CH',
    defaultCity: 'Zurich',
    cities: [
      { city: 'Zurich', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
      { city: 'Geneva', latitude: 46.2044, longitude: 6.1432, timezone: 'Europe/Zurich' },
      { city: 'Basel', latitude: 47.5596, longitude: 7.5886, timezone: 'Europe/Zurich' },
      { city: 'Bern', latitude: 46.9480, longitude: 7.4474, timezone: 'Europe/Zurich' },
    ],
  },
  {
    country: 'Syria',
    code: 'SY',
    defaultCity: 'Damascus',
    cities: [
      { city: 'Damascus', latitude: 33.5138, longitude: 36.2765, timezone: 'Asia/Damascus' },
      { city: 'Aleppo', latitude: 36.2021, longitude: 37.1343, timezone: 'Asia/Damascus' },
      { city: 'Homs', latitude: 34.7324, longitude: 36.7137, timezone: 'Asia/Damascus' },
      { city: 'Latakia', latitude: 35.5317, longitude: 35.7901, timezone: 'Asia/Damascus' },
    ],
  },
  {
    country: 'Tajikistan',
    code: 'TJ',
    defaultCity: 'Dushanbe',
    cities: [
      { city: 'Dushanbe', latitude: 38.5598, longitude: 68.7870, timezone: 'Asia/Dushanbe' },
      { city: 'Khujand', latitude: 40.2826, longitude: 69.6222, timezone: 'Asia/Dushanbe' },
    ],
  },
  {
    country: 'Tanzania',
    code: 'TZ',
    defaultCity: 'Dar es Salaam',
    cities: [
      { city: 'Dar es Salaam', latitude: -6.7924, longitude: 39.2083, timezone: 'Africa/Dar_es_Salaam' },
      { city: 'Zanzibar City', latitude: -6.1659, longitude: 39.2026, timezone: 'Africa/Dar_es_Salaam' },
      { city: 'Dodoma', latitude: -6.1630, longitude: 35.7516, timezone: 'Africa/Dar_es_Salaam' },
    ],
  },
  {
    country: 'Turkmenistan',
    code: 'TM',
    defaultCity: 'Ashgabat',
    cities: [
      { city: 'Ashgabat', latitude: 37.9601, longitude: 58.3261, timezone: 'Asia/Ashgabat' },
      { city: 'Turkmenabat', latitude: 39.0733, longitude: 63.5786, timezone: 'Asia/Ashgabat' },
    ],
  },
  {
    country: 'Uganda',
    code: 'UG',
    defaultCity: 'Kampala',
    cities: [
      { city: 'Kampala', latitude: 0.3476, longitude: 32.5825, timezone: 'Africa/Kampala' },
      { city: 'Entebbe', latitude: 0.0512, longitude: 32.4637, timezone: 'Africa/Kampala' },
    ],
  },

];

// Flat list of all locations for fast lookups & backward compatibility
export const ALL_LOCATIONS: LocationConfig[] = COUNTRIES_DATABASE.flatMap((country) =>
  country.cities.map((city) => ({
    city: city.city,
    country: country.country,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
  }))
);

export const getAllCountries = (): string[] => {
  return COUNTRIES_DATABASE.map((c) => c.country).sort((a, b) => a.localeCompare(b));
};

export const getCitiesForCountry = (countryName: string): LocationConfig[] => {
  const found = COUNTRIES_DATABASE.find(
    (c) => c.country.toLowerCase() === countryName.trim().toLowerCase()
  );
  if (!found) return [];
  return found.cities.map((c) => ({
    city: c.city,
    country: found.country,
    latitude: c.latitude,
    longitude: c.longitude,
    timezone: c.timezone,
  }));
};

export const findLocationByCountryAndCity = (
  countryName: string,
  cityName: string
): LocationConfig | undefined => {
  const countryData = COUNTRIES_DATABASE.find(
    (c) => c.country.toLowerCase() === countryName.trim().toLowerCase()
  );
  if (!countryData) {
    return ALL_LOCATIONS.find(
      (l) => l.city.toLowerCase() === cityName.trim().toLowerCase()
    );
  }
  const cityData = countryData.cities.find(
    (c) => c.city.toLowerCase() === cityName.trim().toLowerCase()
  );
  if (cityData) {
    return {
      city: cityData.city,
      country: countryData.country,
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      timezone: cityData.timezone,
    };
  }
  // Fallback to first city in country
  const fallback = countryData.cities[0];
  if (fallback) {
    return {
      city: fallback.city,
      country: countryData.country,
      latitude: fallback.latitude,
      longitude: fallback.longitude,
      timezone: fallback.timezone,
    };
  }
  return undefined;
};
