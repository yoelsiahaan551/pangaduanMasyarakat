import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ukk_pengaduan",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal connect");
  } else {
    console.log("Database berhasil connect");
  }
});

export default db;