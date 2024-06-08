package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email       string `json:"email"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	DateOfBirth string `json:"dateOfBirth"`
	Password    string `json:"password"`
}

// SignInAttempt represents the user's sign-in attempt
type SignInAttempt struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

const (
	host     = "localhost"
	port     = 5432
	user     = "anupta_comend"
	password = "password"
	dbname   = "comend_db"
)

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares a plain password with a hashed password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func createTables(db *sql.DB) error {

	createRegisteredUsersTable := `
    CREATE TABLE IF NOT EXISTS registered_users (
        email VARCHAR(255) PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        password VARCHAR(50),
        date_of_birth DATE,
        rare_disease VARCHAR(255),
        user_symptoms TEXT,
        created_at TIMESTAMP,
        CONSTRAINT fk_rare_disease
            FOREIGN KEY(rare_disease)
            REFERENCES rare_diseases(rare_disease)
    );`

	createRareDiseasesTable := `
    CREATE TABLE IF NOT EXISTS rare_diseases (
        rare_disease VARCHAR(255) PRIMARY KEY,
        official_symptoms TEXT,
        patient_group_name VARCHAR(255),
        CONSTRAINT fk_patient_group_name
          FOREIGN KEY(patient_group_name)
          REFERENCES patient_groups(patient_group_name)
    );`

	createPatientGroupsTable := `
    CREATE TABLE IF NOT EXISTS patient_groups (
        patient_group_name VARCHAR(255) PRIMARY KEY,
        third_party_url VARCHAR(255),
        known_patient_count INTEGER
    );`

	_, err := db.Exec(createPatientGroupsTable)
	if err != nil {
		return fmt.Errorf("error creating the patient_groups table: %v", err)
	}

	_, err = db.Exec(createRareDiseasesTable)
	if err != nil {
		return fmt.Errorf("error creating the rare_diseases table: %v", err)
	}

	_, err = db.Exec(createRegisteredUsersTable)
	if err != nil {
		return fmt.Errorf("error creating the registered_users table: %v", err)
	}

	return nil
}

func addRecordToPatientGroupTable(c *gin.Context) {

}

func addRecordToRareDiseaseTable(c *gin.Context) {

}

// Handler for registering a user
func registerUserHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := addRecordToRegisteredUsersTable(db, user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("Inserted user: %+v\n", user)
		c.Status(http.StatusCreated)
	}
}

func signInUserHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var userAttempt SignInAttempt

		// Bind the JSON payload to the SignInAttempt struct
		if err := c.ShouldBindJSON(&userAttempt); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if userAttempt.Email == "" || userAttempt.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
			return
		}

		user, err := getUserByEmail(db, userAttempt.Email)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
			}
			return
		}

		if user.Password != userAttempt.Password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user})
	}
}

func getUserByEmail(db *sql.DB, email string) (*User, error) {
	query := "SELECT email, first_name, last_name, date_of_birth, password FROM registered_users WHERE email=$1"
	row := db.QueryRow(query, email)

	// fmt.Println(row.Scan())

	var user User
	err := row.Scan(&user.Email, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.Password)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Function to insert a user into the database
func addRecordToRegisteredUsersTable(db *sql.DB, user User) error {
	query := `
    INSERT INTO registered_users (email, first_name, last_name, date_of_birth, password)
    VALUES ($1, $2, $3, $4, $5)`

	_, err := db.Exec(query, user.Email, user.FirstName, user.LastName, user.DateOfBirth, user.Password)
	return err
}

func checkIfUserIsRegistered(db *sql.DB, userAttempt SignInAttempt) (*User, error) {
	query := "SELECT email, firstName, lastName, dateOfBirth, password FROM registered_users WHERE email=$1 AND password=$2"

	row := db.QueryRow(query, userAttempt.Email, userAttempt.Password)

	var user User

	err := row.Scan(&user.FirstName, &user.LastName, &user.Email, &user.Password, &user.DateOfBirth)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func deleteAllTables(db *sql.DB) error {
	// Step 1: Retrieve all table names in the public schema
	rows, err := db.Query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public';
    `)
	if err != nil {
		return fmt.Errorf("failed to retrieve tables: %w", err)
	}
	defer rows.Close()

	// Step 2: Collect table names
	var tables []string
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return fmt.Errorf("failed to scan table name: %w", err)
		}
		tables = append(tables, tableName)
	}
	if err := rows.Err(); err != nil {
		return fmt.Errorf("error iterating over table names: %w", err)
	}

	// Step 3: Generate and execute DROP TABLE statements
	for _, table := range tables {
		dropTableSQL := fmt.Sprintf("DROP TABLE IF EXISTS %s CASCADE;", table)
		_, err := db.Exec(dropTableSQL)
		if err != nil {
			return fmt.Errorf("failed to drop table %s: %w", table, err)
		}
		fmt.Printf("Dropped table: %s\n", table)
	}

	return nil
}

func main() {

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// deleteAllTables(db)

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected to the database!")
	err = createTables(db)
	fmt.Println("Tables created successfully!")

	// endpoints
	requests := gin.Default()
	requests.Use(cors.Default())

	requests.POST("/api/registerUser", registerUserHandler(db))
	requests.POST("/api/signIn", signInUserHandler(db))

	if err != nil {
		log.Fatalf("Error creating tables: %v", err)
	}

	// Start the server
	fmt.Println("Server is running on port 8080")
	requests.Run(":8080")
}
