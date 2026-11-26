const { z } = require("zod");

const productFields = {
productName: z.string().trim().min(1, "Product name is required").max(150),
sku: z.string().trim().min(1, "SKU is required").max(50),
category: z.string().trim().min(1, "Category is required").max(100),
price: z.number().nonnegative("Price cannot be negative"),
cost: z.number().nonnegative("Cost cannot be negative"),
stockQuantity: z.number().int().nonnegative("Stock quantity cannot be negative"),
reorderLevel: z.number().int().nonnegative("Reorder level cannot be negative"),
lastUpdated: z.coerce.date().optional(),
};

const createProductSchema = z
.object(productFields)
.strict()
.refine((data) => data.price >= data.cost, {
message: "Price cannot be lower than cost",
path: ["price"],
});

const updateProductSchema = z
.object(productFields)
.partial()
.strict()
.refine((data) => Object.keys(data).length > 0, {
message: "At least one field is required",
})
.refine(
(data) =>
data.price === undefined ||
data.cost === undefined ||
data.price >= data.cost,
{
message: "Price cannot be lower than cost",
path: ["price"],
}
);

module.exports = {
createProductSchema,
updateProductSchema,
};