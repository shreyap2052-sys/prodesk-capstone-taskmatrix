const Product = require("../models/Product");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getInventory = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100
    );
    const { search = "", category = "", sort = "-lastUpdated" } = req.query;

    const filter = {};

    if (search.trim()) {
      filter.productName = {
        $regex: escapeRegex(search.trim()),
        $options: "i",
      };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const allowedSortFields = [
      "productName",
      "sku",
      "category",
      "price",
      "cost",
      "stockQuantity",
      "lastUpdated",
    ];

    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortOptions = allowedSortFields.includes(sortField)
      ? { [sortField]: sortOrder }
      : { lastUpdated: -1 };

    const [products, totalRecords] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedFields = req.body;
    const finalPrice = updatedFields.price ?? product.price;
    const finalCost = updatedFields.cost ?? product.cost;

    if (finalPrice < finalCost) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be lower than cost",
      });
    }

    Object.assign(product, updatedFields);
    product.lastUpdated = new Date();

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const match = req.query.category
      ? { category: req.query.category }
      : {};

    const analytics = await Product.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stockQuantity" },
          totalValuation: {
            $sum: { $multiply: ["$price", "$stockQuantity"] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalProducts: 1,
          totalStock: 1,
          totalValuation: { $round: ["$totalValuation", 2] },
        },
      },
      { $sort: { totalValuation: -1 } },
    ]);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAnalytics,
};