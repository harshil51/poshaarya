# POSHAARYA Security, Backup & Archiving Strategy

## 1. Security & Compliance
As a health and wellness application processing medical data and payments, strict compliance with global standards is required.

### Data Encryption (At Rest & In Transit)
*   **In Transit:** Force TLS 1.3 for all database connections (`require_secure_transport = ON` in MySQL).
*   **At Rest:** Enable InnoDB Data at Rest Encryption (TDE - Transparent Data Encryption). All physical files, including backups, must be encrypted.
*   **Sensitive Data:** PII (Personally Identifiable Information) such as `emergency_contacts` or specific `health_profiles` data (e.g., medical conditions) should ideally be encrypted at the application layer before being inserted into the database.

### HIPAA & GDPR Compliance
*   **GDPR Right to be Forgotten:** Implement a cascading soft delete followed by an automated hard-delete script that runs 30 days after account deletion request. PII must be scrubbed, but anonymized aggregate data (like macro trends) can be kept.
*   **Audit Logging:** Every administrative action, profile change, and access to medical data MUST be logged in the `audit_logs` table (implemented in Phase 4).

## 2. Backup Strategy
To ensure zero data loss and fast recovery times for an enterprise SaaS.

*   **RPO (Recovery Point Objective):** 5 Minutes
*   **RTO (Recovery Time Objective):** < 1 Hour

### Backup Tiers
1.  **Continuous / Real-Time:** MySQL replication to a standby instance in a different Availability Zone (AZ).
2.  **Point-in-Time Recovery (PITR):** Enable MySQL Binary Logs (Binlogs). Keep binlogs for at least 7 days. This allows restoring the database to any specific second.
3.  **Daily Snapshots:** Automated nightly Volume Snapshots (e.g., AWS EBS Snapshots) stored in an isolated, tamper-proof Cloud storage bucket (S3 Glacier). Retain for 30 days.
4.  **Weekly Logical Backups:** Run `mysqldump` or `mydumper` weekly. Compress and encrypt, then store in cold storage for 1-7 years depending on compliance requirements.

## 3. Data Retention & Archiving Strategy
Keeping 150 Million meals active in the hot database forever degrades performance.

*   **Hot Data (SSD):** Last 12 months of `meals`, `exercise_logs`, `invoices`, and active `sessions`.
*   **Warm Data (HDD or Cheaper Storage):** 1 to 3 years old. Archived via MySQL Partition detaching.
*   **Cold Storage (S3 / Glacier):** Anything older than 3 years. Exported to CSV/Parquet formats and deleted from the live MySQL database.
*   **Transactional Ephemeral Data:** 
    *   `auth_sessions`, `auth_otps`, and `auth_refresh_tokens` are hard-deleted automatically via the MySQL Event Scheduler (implemented in Phase 5) once they expire.
