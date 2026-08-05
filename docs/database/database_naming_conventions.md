# POSHAARYA Database Naming Conventions & Rules

To ensure a highly scalable, maintainable, and uniform database architecture, the following conventions are strictly enforced across the POSHAARYA database.

## 1. General Naming Rules
*   **Case:** `snake_case` must be used for all databases, tables, columns, constraints, and indexes.
*   **Pluralization:** Table names must be plural (e.g., `users`, `organizations`, `meals`).
*   **Prefixes:**
    *   No table prefixes (e.g., avoid `tbl_users`).
    *   Join tables must combine the two table names in alphabetical order, separated by an underscore (e.g., `role_user`, `food_meal`).

## 2. Columns
*   **Primary Keys:** Must be named `id` and use `CHAR(36)` to store UUIDs. `AUTO_INCREMENT` is strictly prohibited.
*   **Foreign Keys:** Must take the singular form of the referenced table followed by `_id` (e.g., `user_id`, `organization_id`). They must be `CHAR(36)` to match the UUID length.
*   **Booleans:** Should be prefixed with `is_`, `has_`, or `can_` (e.g., `is_active`, `has_premium`, `can_edit`). Type should be `TINYINT(1)`.
*   **Dates & Times:** 
    *   Dates only: suffixed with `_date` (e.g., `birth_date`). Use `DATE`.
    *   Timestamps: suffixed with `_at` (e.g., `created_at`, `login_at`). Use `DATETIME` or `TIMESTAMP`.

## 3. Standard SaaS Columns
Every standard business entity table MUST contain:
```sql
id CHAR(36) PRIMARY KEY,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL DEFAULT NULL,
created_by CHAR(36) NULL,
updated_by CHAR(36) NULL
```
Where applicable for multi-tenancy:
```sql
organization_id CHAR(36) NOT NULL
```
Where applicable for versioning:
```sql
version INT NOT NULL DEFAULT 1
```

## 4. Constraints & Indexes
*   **Foreign Keys (FK):** Named as `fk_<table_name>_<column_name>`.
*   **Primary Keys (PK):** Handled implicitly as `PRIMARY`.
*   **Unique Constraints (UQ):** Named as `uq_<table_name>_<column_name>`.
*   **Indexes (IDX):** Named as `idx_<table_name>_<column_name(s)>`.

## 5. Soft Delete vs. Permanent Delete
*   **Soft Deletion:** Business entities (Users, Organizations, Foods, Workouts, Meals) use the `deleted_at` column. Queries MUST filter `WHERE deleted_at IS NULL`.
*   **Permanent Deletion (Hard Delete):** Transactional/ephemeral data like OTPs, Sessions, and Refresh Tokens.

## 6. Multi-Tenancy Strategy
POSHAARYA implements a **Row-level Tenancy model**. 
All tenant-specific data must contain an `organization_id` foreign key. The application layer (and Database Views if used) must strictly append `WHERE organization_id = ?` to all relevant queries.

## 7. Versioning Strategy
Immutable versioning is used for critical entities like `foods`, `recipes`, and `meal_plans`. When an edit occurs:
1. The old record remains untouched.
2. A new record is created with the incremented `version` number.
3. Foreign references point to a specific version, preventing historical data corruption.

## 8. Data Types (MySQL 8.0)
*   **UUID:** `CHAR(36)`
*   **Strings:** `VARCHAR(255)` for short strings, `TEXT` or `JSON` for larger dynamic structures.
*   **Decimals:** `DECIMAL(10, 2)` for currency/payments. `DECIMAL(8,3)` or `FLOAT` for nutrition/weight/measurements.
*   **Enums:** Avoid MySQL `ENUM`. Use `VARCHAR` with Application-level validation or a strict Lookup Table for extensibility.
