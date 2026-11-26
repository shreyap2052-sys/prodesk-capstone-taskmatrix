## Sprint 18 – Inventory Management & Analytics

This sprint extends the Task Matrix backend with an inventory management system designed to handle a large product dataset.

### Product Inventory

- Created a Product model with product name, SKU, category, price, cost, stock quantity, reorder level, and last-updated fields.
- Generated and seeded 50,000 sample products using Faker.
- Added MongoDB indexes for SKU, category, and product name.
- Implemented paginated inventory retrieval with search, category filtering, and sorting.
- Added product creation, updating, and deletion endpoints.
- Implemented Zod validation for product requests.
- Enforced business rules, including non-negative stock quantities and price not being lower than cost.

### Inventory Analytics

- Implemented category-wise inventory analytics using MongoDB aggregation.
- Used `$match`, `$group`, and `$project` stages.
- Calculated total products, total stock, and inventory valuation for each category.

### Inventory API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | Retrieve paginated inventory |
| POST | `/api/inventory` | Create a product |
| PUT | `/api/inventory/:id` | Update a product |
| DELETE | `/api/inventory/:id` | Delete a product |
| GET | `/api/analytics` | Retrieve category-wise analytics |

**Supported inventory query parameters:** `page`, `limit`, `search`, `category`, and `sort`.

### Database Seeding

The standalone Faker seeder generates 50,000 sample products in batches.

Run from the backend directory:

```bash
npm run seed
```

Note: The seeder clears existing Product records before inserting the generated dataset.

### Verification

- Verified 50,000 product records in MongoDB.
- Confirmed the required database indexes.
- Tested inventory retrieval and analytics endpoints locally.