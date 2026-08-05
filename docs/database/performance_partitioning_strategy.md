# POSHAARYA Performance & Partitioning Strategy

This document outlines the strategy to handle 1 Million Users, 150 Million Meals, 40 Million Exercise Logs, and 10,000 Concurrent Users.

## 1. Expected Database Scale
*   **Users:** 1,000,000+
*   **Meals (`meals` and `meal_items`):** 150,000,000+
*   **Exercise Logs:** 40,000,000+
*   **Concurrent Traffic:** ~10,000 requests per second (peak)

## 2. Partitioning Strategy (MySQL 8.0)
Due to the sheer volume of time-series data (Meals, Workouts), we must implement MySQL Partitioning by `RANGE` on the `meal_date` and `log_date` columns.

### Partitioning the Meals Table
```sql
ALTER TABLE meals PARTITION BY RANGE (YEAR(meal_date)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```
*Why?* Most users query their diary for the current week/month. Archiving older partitions becomes a simple `DROP PARTITION` or detaching it to cold storage.

## 3. Read Replicas & CQRS
*   **Primary DB (Master):** Handles all `INSERT`, `UPDATE`, `DELETE` operations (e.g., logging a meal, saving a workout).
*   **Read Replicas:** Handle all `SELECT` operations (e.g., viewing dashboards, pulling reports).
*   **Routing:** The Application layer (Prisma or Knex) must route reads to the Replica endpoint and writes to the Master.

## 4. Caching Layer (Redis)
To prevent the DB from dying under 10k concurrent users, Redis MUST be placed in front of MySQL.
*   **Session Management:** `auth_sessions` checked via Redis before hitting the DB.
*   **Food Search:** Frequently searched foods (e.g., "Banana", "Chicken Breast") must be cached in Redis with a TTL of 24 hours.
*   **User Dashboard:** Aggregate data (like `v_user_daily_macros`) should be cached per user for the current day. Invalidate cache on new meal log.

## 5. Sharding (Future Scaling)
If read replicas and partitioning hit a ceiling, we implement application-level sharding based on the `organization_id` or geographical regions (e.g., India DB cluster vs US DB cluster).

## 6. Search Engine (Elasticsearch / Algolia)
While `FULLTEXT` indexes are created in Phase 5, searching through 100,000+ foods with synonyms and misspellings (fuzzy matching) requires a dedicated search engine.
*   **Sync:** Use Debezium (Change Data Capture) or Application Webhooks to sync `foods`, `food_versions`, and `food_synonyms` into Elasticsearch.
