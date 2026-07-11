---
title: "Normalization and Denormalization — System Design Notes"
---

Imagine if your home phone book listed every friend's address, family, and office right next to their entry - if a family detail changes, you'd have to update every entry with it. Forget one, and you get inconsistency. In databases, this problem is called **data redundancy**. The solution - **Normalization**.

## What is Normalization?

**Database Normalization** = organizing a table so that data redundancy is reduced and dependencies stay correct. It was proposed by E.F. Codd in the 1970s.

## Why Normalize?

- **Less data redundancy:** The same data isn't repeated.
- **No update anomalies:** Change it in one place = correct everywhere.
- **No insert anomalies:** You can add a new entry without needing sub-data.
- **No delete anomalies:** Deleting one row doesn't lose other unrelated data.
- **Storage savings:** No duplicate data.
- **Data integrity:** Can be enforced with foreign keys.

## Anomalies - Why Normalization Is Needed

Here's a poor design — a `student_courses` table with columns id, name, course, teacher, tea_phone, where the same teacher and phone number repeat across every row for students in the same course:

- **Update anomaly:** If a teacher's phone number changes → every row for their course needs updating.
- **Insert anomaly:** A new course can't be added unless a student is enrolled in it.
- **Delete anomaly:** Deleting the only student in a course would also lose that course's teacher information.

## Normal Forms

### 1. First Normal Form (1NF)

Every column must hold an **atomic** value (a single value) - not a list/array. E.g. splitting a `phones` column holding "0171, 0172, 0173" into one row per phone number.

### 2. Second Normal Form (2NF)

1NF + every non-key column must depend on the whole primary key (no partial dependency).

In the student_courses table above, name (depends on id) and teacher (depends on course) show partial dependency. Split it into:

```
students: | id | name |
courses: | course | teacher | tea_phone |
enrollments: | student_id | course |
```

### 3. Third Normal Form (3NF)

2NF + non-key columns must not depend on each other (no transitive dependency).

In the courses table, teacher → tea_phone is transitive. Split it:

```
courses: | course | teacher_id |
teachers: | teacher_id | name | phone |
```

### 4. BCNF (Boyce-Codd Normal Form)

A stricter version of 3NF - the left side of every functional dependency must be a super key. Equivalent to 3NF except for rare edge cases.

### 5. 4NF, 5NF, 6NF

Address multi-valued dependencies and join dependencies - academically important but rarely used in practice.

**Note:** Industry rule of thumb - normalize up to 3NF. That's the right balance for OLTP systems.

## What is Denormalization?

**Denormalization** = deliberately duplicating some data, breaking normalized form, to boost read performance.

Getting student-course-teacher info from three normalized tables requires a JOIN. That's slow in a read-heavy app. So fields get copied into a single `enrollments` table (student_id, student_name, course, teacher_name). Now it's all in one query. But if the teacher's name changes, it needs updating in many places.

## When to Denormalize?

- Read-heavy workloads (1:100+ ratio).
- JOIN performance is a problem.
- Reporting/analytics - where historical accuracy isn't required.
- NoSQL DBs - where JOINs don't exist or are expensive.
- Pre-computed aggregates (counts, totals).

## Trade-off

**Normalized**
- Less storage
- Simple updates
- Strong data integrity
- Reads require JOINs, slower
- Ideal for OLTP

**Denormalized**
- Fast reads (single table)
- More storage
- Complex updates
- Risk of inconsistency
- For analytics, NoSQL

## Real-World Examples

- **Banking:** Highly normalized - accuracy is critical.
- **Twitter timeline:** Denormalized - pre-computed, fast reads.
- **Data warehouse (Snowflake, BigQuery):** Heavily denormalized (star/snowflake schema).
- **MongoDB:** Generally denormalized (embeds sub-documents).

## Common Misconceptions

1. **"More normalized is always better":** No - 4NF/5NF is usually overkill.
2. **"Denormalization means wrong":** No - it's a normal optimization for read-heavy apps.
3. **"NoSQL doesn't need normalization":** It exists implicitly - in the schema design.

## Best Practices

- Start at 3NF - stay there unless there's a performance problem.
- Denormalize deliberately - measure first.
- Enable foreign key constraints - for referential integrity.
- Try scaling reads with a read replica + cache - before reaching for denormalization.
- Keep the stale-data update process clear when denormalizing.

## Chapter Summary

- Normalization = reducing redundancy (1NF, 2NF, 3NF, BCNF).
- Protects against update/insert/delete anomalies.
- Denormalization = deliberately duplicating data to speed up reads.
- OLTP → normalized; OLAP/NoSQL → denormalized.
- Trade-off: storage/integrity vs read speed.
