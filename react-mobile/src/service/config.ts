const config = {
  // company http://192.168.31.85:3022
  // local http://localhost:3022
  baseUrl: process.env.NODE_ENV === "development" ? "http://121.5.90.202:3022" : "http://121.5.90.202:3022"
}

export default config