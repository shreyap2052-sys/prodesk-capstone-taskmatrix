
require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../models/Product");

const TOTAL_PRODUCTS = 50000;
const BATCH_SIZE = 1000;

const categories = [
  "electronics",
  "furniture",
  "clothing",
  "groceries",
  "accessories",
  "appliances",
  "sports",
  "stationery",
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding.");

    // Remove previous generated inventory to avoid duplicate SKUs.
    await Product.deleteMany({});

    console.log("Generating 50,000 products...");

    for (let start = 0; start < TOTAL_PRODUCTS; start += BATCH_SIZE) {
      const batch = [];

      const batchSize = Math.min(
        BATCH_SIZE,
        TOTAL_PRODUCTS - start
      );

      for (let i = 0; i < batchSize; i++) {
        const cost = Number(
          faker.number.float({
            min: 10,
            max: 50000,
            fractionDigits: 2,
          })
        );

        const price = Number(
          (cost * faker.number.float({
            min: 1.1,
            max: 2.5,
            fractionDigits: 2,
          })).toFixed(2)
        );

        batch.push({
          productName: faker.commerce.productName(),
          sku: `SKU-${String(start + i + 1).padStart(6, "0")}`,
          category: faker.helpers.arrayElement(categories),
          price,
          cost,
          stockQuantity: faker.number.int({
            min: 0,
            max: 1000,
          }),
          reorderLevel: faker.number.int({
            min: 10,
            max: 100,
          }),
          lastUpdated: faker.date.recent({
            days: 365,
          }),
        });
      }

      await Product.insertMany(batch, { ordered: true });

      console.log(
        `Inserted ${start + batchSize}/${TOTAL_PRODUCTS} products`
      );
    }

    const total = await Product.countDocuments();

    console.log(`Seeding completed! Total products: ${total}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
