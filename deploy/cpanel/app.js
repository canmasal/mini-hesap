/*
 * cPanel "Application Manager" (Phusion Passenger) giriş dosyası.
 * Passenger varsayılan olarak app.js'i çalıştırır; Next.js'in standalone
 * sunucusunu başlatır. Port'u Passenger kendisi yönetir.
 */
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
require("./server.js");
