package database

import (
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "log"
    "os"
)

var DB *gorm.DB

func ConnectDatabase() {
    dsn := "host=" + os.Getenv("DB_HOST") +
           " user=" + os.Getenv("DB_USER") +
           " password=" + os.Getenv("DB_PASSWORD") +
           " dbname=" + os.Getenv("DB_NAME") +
           " port=" + os.Getenv("DB_PORT") +
           " sslmode=disable"

    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
}
