export default {
  // company http://192.168.31.85:3022
  // home http://192.168.101.100:3022
  baseUrl: process.env.NODE_ENV === "development" ? "http://192.168.101.100:3022" : "http://106.13.207.132:3022"
}