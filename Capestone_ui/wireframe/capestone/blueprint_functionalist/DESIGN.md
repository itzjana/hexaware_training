-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0; SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0; SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
--------------------------------------------------------------------------------
-- Schema mydb
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Schema capestone_db
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Schema capestone_db
--------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS capestone_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ; USE capestone_db ;
--------------------------------------------------------------------------------
-- Table capestone_db.insurance_policy
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.insurance_policy ( id INT NOT NULL AUTO_INCREMENT, base_rate DOUBLE NOT NULL, created_at DATETIME(6) NULL DEFAULT NULL, description VARCHAR(255) NULL DEFAULT NULL, policy_name VARCHAR(255) NOT NULL, updated_at DATETIME(6) NULL DEFAULT NULL, PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.users
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.users ( id INT NOT NULL AUTO_INCREMENT, created_at DATETIME(6) NULL DEFAULT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NULL DEFAULT NULL, role ENUM('ADMIN', 'CUSTOMER', 'INSURANCE_OFFICER') NULL DEFAULT NULL, updated_at DATETIME(6) NULL DEFAULT NULL, username VARCHAR(255) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX UK6dotkott2kjsp8vw4d0m25fb7 (email ASC) VISIBLE, UNIQUE INDEX UKr43af9ap4edm43mmtq01oddj6 (username ASC) VISIBLE) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.customer
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.customer ( id INT NOT NULL AUTO_INCREMENT, aadhar_number VARCHAR(255) NOT NULL, address VARCHAR(255) NULL DEFAULT NULL, dob DATE NOT NULL, name VARCHAR(255) NOT NULL, pan_number VARCHAR(255) NOT NULL, user_id INT NULL DEFAULT NULL, PRIMARY KEY (id), UNIQUE INDEX UKj7ja2xvrxudhvssosd4nu1o92 (user_id ASC) VISIBLE, CONSTRAINT FKra1cb3fu95r1a0m7aksow0nk4 FOREIGN KEY (user_id) REFERENCES capestone_db.users (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.vehicle
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.vehicle ( id INT NOT NULL AUTO_INCREMENT, category ENUM('BIKE', 'CAMPER_VAN', 'CAR', 'MOTORCYCLE', 'TRUCK') NOT NULL, manufacture_year INT NOT NULL, registration_number VARCHAR(255) NOT NULL, customer_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKlwqsusjj6iodeb0df1b554vxq (customer_id ASC) VISIBLE, CONSTRAINT FKlwqsusjj6iodeb0df1b554vxq FOREIGN KEY (customer_id) REFERENCES capestone_db.customer (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.officer
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.officer ( id INT NOT NULL AUTO_INCREMENT, job_title ENUM('ASSOCIATE_EXECUTIVE', 'MANAGER', 'SENIOR_EXECUTIVE', 'TECHNICAL_EXECUTIVE') NULL DEFAULT NULL, name VARCHAR(255) NULL DEFAULT NULL, user_id INT NULL DEFAULT NULL, PRIMARY KEY (id), UNIQUE INDEX UKr5t0ybfiw47rri8hejrk7u460 (user_id ASC) VISIBLE, CONSTRAINT FKihp7h4or6t2b7avh7xafx5b7w FOREIGN KEY (user_id) REFERENCES capestone_db.users (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.policy_proposal
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.policy_proposal ( id INT NOT NULL AUTO_INCREMENT, end_date DATE NULL DEFAULT NULL, officer_remark VARCHAR(255) NULL DEFAULT NULL, policy_unique_id VARCHAR(255) NULL DEFAULT NULL, start_date DATE NULL DEFAULT NULL, status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PROPOSAL_SUBMITTED', 'QUOTE_GENERATED', 'REJECTED', 'RENEWED', 'VERIFIED') NULL DEFAULT NULL, submission_date DATE NULL DEFAULT NULL, updated_at DATETIME(6) NULL DEFAULT NULL, customer_id INT NULL DEFAULT NULL, officer_id INT NULL DEFAULT NULL, policy_id INT NULL DEFAULT NULL, vehicle_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKagkdljlyjk4eym64s4xkve336 (customer_id ASC) VISIBLE, INDEX FK7xnmvocu3j068yyjj5lg9fmtb (officer_id ASC) VISIBLE, INDEX FK2k3bpar7xowbq2cib01klfdsc (policy_id ASC) VISIBLE, INDEX FK4yoidt9ub271lvkd74dpywxk2 (vehicle_id ASC) VISIBLE, CONSTRAINT FK2k3bpar7xowbq2cib01klfdsc FOREIGN KEY (policy_id) REFERENCES capestone_db.insurance_policy (id), CONSTRAINT FK4yoidt9ub271lvkd74dpywxk2 FOREIGN KEY (vehicle_id) REFERENCES capestone_db.vehicle (id), CONSTRAINT FK7xnmvocu3j068yyjj5lg9fmtb FOREIGN KEY (officer_id) REFERENCES capestone_db.officer (id), CONSTRAINT FKagkdljlyjk4eym64s4xkve336 FOREIGN KEY (customer_id) REFERENCES capestone_db.customer (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.claim
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.claim ( id INT NOT NULL AUTO_INCREMENT, created_at DATETIME(6) NULL DEFAULT NULL, incident_description VARCHAR(255) NULL DEFAULT NULL, officer_note VARCHAR(255) NULL DEFAULT NULL, status ENUM('APPROVED', 'INITIATED', 'REJECTED', 'UNDER_REVIEW') NULL DEFAULT NULL, officer_id INT NULL DEFAULT NULL, policy_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKjs8iainwyavhnkaaj147y9x6w (officer_id ASC) VISIBLE, INDEX FKfty2o6q6b5g212f88s236xl7w (policy_id ASC) VISIBLE, CONSTRAINT FKfty2o6q6b5g212f88s236xl7w FOREIGN KEY (policy_id) REFERENCES capestone_db.policy_proposal (id), CONSTRAINT FKjs8iainwyavhnkaaj147y9x6w FOREIGN KEY (officer_id) REFERENCES capestone_db.officer (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.document
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.document ( id INT NOT NULL AUTO_INCREMENT, document_path VARCHAR(255) NULL DEFAULT NULL, document_type ENUM('AADHAAR', 'CLAIM_IMAGE', 'PAN', 'POLICY_PDF', 'VEHICLE_REGISTRATION') NULL DEFAULT NULL, user_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKm19xjdnh3l6aueyrpm1705t52 (user_id ASC) VISIBLE, CONSTRAINT FKm19xjdnh3l6aueyrpm1705t52 FOREIGN KEY (user_id) REFERENCES capestone_db.users (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.claim_documents
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.claim_documents ( claim_id INT NOT NULL, documents_id INT NOT NULL, UNIQUE INDEX UKso99ywqa3l5iuvk2i4xvlosmw (documents_id ASC) VISIBLE, INDEX FKr0xusoabbhxa31pj1obiknlwf (claim_id ASC) VISIBLE, CONSTRAINT FK40quicirp15996cf85xr0om1p FOREIGN KEY (documents_id) REFERENCES capestone_db.document (id), CONSTRAINT FKr0xusoabbhxa31pj1obiknlwf FOREIGN KEY (claim_id) REFERENCES capestone_db.claim (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.notification_log
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.notification_log ( id INT NOT NULL AUTO_INCREMENT, notification_type VARCHAR(255) NULL DEFAULT NULL, send_at DATETIME(6) NULL DEFAULT NULL, user_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FK1hsuml782h11aaw5f387d5evf (user_id ASC) VISIBLE, CONSTRAINT FK1hsuml782h11aaw5f387d5evf FOREIGN KEY (user_id) REFERENCES capestone_db.users (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.quote
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.quote ( id INT NOT NULL AUTO_INCREMENT, calculated_amount DOUBLE NOT NULL, officer_id INT NULL DEFAULT NULL, proposal_id INT NULL DEFAULT NULL, PRIMARY KEY (id), UNIQUE INDEX UKmtuxjnw113uh44am6kn9w3xjn (proposal_id ASC) VISIBLE, INDEX FKbq99w474tls5in17kpdnkmqqa (officer_id ASC) VISIBLE, CONSTRAINT FK4hx56sl3a32hq3gao3vi0sg00 FOREIGN KEY (proposal_id) REFERENCES capestone_db.policy_proposal (id), CONSTRAINT FKbq99w474tls5in17kpdnkmqqa FOREIGN KEY (officer_id) REFERENCES capestone_db.officer (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.payment
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.payment ( id INT NOT NULL AUTO_INCREMENT, amount DOUBLE NOT NULL, payment_date DATETIME(6) NULL DEFAULT NULL, status ENUM('FAILED', 'PENDING', 'SUCCESS', 'VERIFIED') NULL DEFAULT NULL, quote_id INT NULL DEFAULT NULL, PRIMARY KEY (id), UNIQUE INDEX UKod6nt81shjoodp46jh4adpqq2 (quote_id ASC) VISIBLE, CONSTRAINT FKlao46v71b2i0dpibbvx7g2y7d FOREIGN KEY (quote_id) REFERENCES capestone_db.quote (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.policy_add_on
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.policy_add_on ( id INT NOT NULL AUTO_INCREMENT, additional_cost DOUBLE NOT NULL, description VARCHAR(255) NULL DEFAULT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.policy_proposal_add_on
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.policy_proposal_add_on ( id INT NOT NULL AUTO_INCREMENT, policy_add_on_id INT NULL DEFAULT NULL, policy_proposal_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKchjytybjk61pgntwmp37vovv1 (policy_add_on_id ASC) VISIBLE, INDEX FKiyhj10ak00g5tv7826a2dlair (policy_proposal_id ASC) VISIBLE, CONSTRAINT FKchjytybjk61pgntwmp37vovv1 FOREIGN KEY (policy_add_on_id) REFERENCES capestone_db.policy_add_on (id), CONSTRAINT FKiyhj10ak00g5tv7826a2dlair FOREIGN KEY (policy_proposal_id) REFERENCES capestone_db.policy_proposal (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.policy_proposal_documents
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.policy_proposal_documents ( policy_proposal_id INT NOT NULL, documents_id INT NOT NULL, UNIQUE INDEX UKixqrotn1p4sw5m4fm8qju4qbx (documents_id ASC) VISIBLE, INDEX FKab42kjwiqu4h28fsc0fmb6xky (policy_proposal_id ASC) VISIBLE, CONSTRAINT FKab42kjwiqu4h28fsc0fmb6xky FOREIGN KEY (policy_proposal_id) REFERENCES capestone_db.policy_proposal (id), CONSTRAINT FKgqu6x1bvg7mn8d657u1yi82of FOREIGN KEY (documents_id) REFERENCES capestone_db.document (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--------------------------------------------------------------------------------
-- Table capestone_db.user_review
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS capestone_db.user_review ( id INT NOT NULL AUTO_INCREMENT, rating INT NOT NULL, review_content VARCHAR(500) NULL DEFAULT NULL, customer_id INT NULL DEFAULT NULL, PRIMARY KEY (id), INDEX FKk30rt247qahnwrfoj8e2s6of (customer_id ASC) VISIBLE, CONSTRAINT FKk30rt247qahnwrfoj8e2s6of FOREIGN KEY (customer_id) REFERENCES capestone_db.customer (id)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
SET SQL_MODE=@OLD_SQL_MODE; SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;