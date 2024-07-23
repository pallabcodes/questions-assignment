const { Question, Category } = require('../models');
const csv = require('fast-csv');
const fs = require('fs');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const getQuestionsForEachCategory = async (req, res, next) => {
  /* 	#swagger.tags = ['Question']
        #swagger.description = 'Endpoint to retrieve question(s) by its category or categories' */

  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  let { categories = [], pageNumber = 1, pageSize = 10 } = req.query;

  try {
    pageNumber = parseInt(pageNumber, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 50;

    // Convert categories to an array of ObjectIds
    let objectIds = Array.isArray(categories)
      ? categories
      : categories.split(',').map((id) => id.trim());

    const categoryObjectIds = objectIds.length
      ? objectIds.map((categoryId) => new mongoose.Types.ObjectId(categoryId))
      : []; // Use an empty array if no categories provided

    // Aggregation pipeline
    const stages = [];

    if (categoryObjectIds.length > 0) {
      stages.push({
        $match: {
          categories: { $in: categoryObjectIds },
        },
      });
    }

    stages.push(
      {
        $sort: { createdAt: -1 }, // Sort by creation date (descending)
      },
      {
        $skip: (Number(pageNumber) - 1) * Number(pageSize), // Apply pagination (skip)
      },
      {
        $limit: Number(pageSize), // Apply pagination (limit)
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $unwind: {
          path: '$categories',
          preserveNullAndEmptyArrays: true, // To include questions with no categories
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          difficulty: { $first: '$difficulty' },
          categories: { $push: '$categories' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      }
    );

    const pipeline = [
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: stages,
        },
      },
    ];

    // Execute the aggregation pipeline
    const questions = await Question.aggregate(pipeline);
    const totalItems = questions[0].metadata[0].totalCount;

    res.json({
      data: questions[0].data,
      pagination: {
        totalCount: questions[0].metadata[0].totalCount,
        perPage: pageSize,
        currentPage: pageNumber,
        lastPage: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Utility function to create or get category ObjectIds
const getCategoryObjectIds = async (categoryNames) => {
  try {
    // Find existing categories
    const categories = await Category.find({ name: { $in: categoryNames } });
    const existingCategoryMap = new Map(
      categories.map((category) => [category.name.toLowerCase(), category._id])
    );

    // Find missing categories
    const missingCategoryNames = categoryNames.filter(
      (name) => !existingCategoryMap.has(name.toLowerCase())
    );

    // Create missing categories
    const newCategories = await Promise.all(
      missingCategoryNames.map((name) => {
        return Category.create({
          name: name,
          description: 'Not Provided', // Default description
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        });
      })
    );

    // Update the map with newly created categories
    newCategories.forEach((category) => {
      existingCategoryMap.set(category.name.toLowerCase(), category._id);
    });

    // Return ObjectIds for the provided category names
    return categoryNames.map((name) =>
      existingCategoryMap.get(name.toLowerCase())
    );
  } catch (error) {
    logger.error('Error in getCategoryObjectIds:', error);
    throw new Error('Error processing categories');
  }
};

// Function to bulk import questions
const bulkImportQuestions = async (req, res, next) => {
  /* 	#swagger.tags = ['Question']
        #swagger.description = 'Endpoint to add bulk question(s) by its category or categories' */

  /*	#swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    "schema": { 
                      "type": "object",
                      "required": ["file"],
                      "properties": {
                      "file": {
                            "type": "string",
                            "format": "binary"
                        }
                      }
                  }
                }
            }
        } */

  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  const filePath = req.file?.path;
  const userId = req.user;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({
      message: 'File not found or invalid file. Please upload a CSV file.',
    });
  }

  try {
    const questions = [];

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv.parse({ headers: true }));

    for await (const row of stream) {
      try {
        // If any of these 3 properties are missing, skip the row
        if (!row.title || !row.difficulty || !row.categories) {
          logger.warn('Skipping the incomplete row:', row);
          continue;
        }

        // Split categories and trim whitespace
        const categoryNames = row.categories
          .split(',')
          .map((cat) => cat.trim());

        // Get or create category ObjectIds
        const categoryObjectIds = await getCategoryObjectIds(categoryNames);

        // Check if a question with the same title, categories, and user already exists
        const existingQuestion = await Question.findOne({
          title: row.title,
          categories: { $all: categoryObjectIds },
          createdBy: userId, // Ensure question is unique per user
        });

        if (existingQuestion) {
          logger.warn(`Skipping duplicate question: ${row.title}`);
          continue;
        }

        // Prepare the question object
        const question = {
          title: row.title,
          difficulty: row.difficulty,
          categories: categoryObjectIds,
          createdBy: userId, // Set the creator user ID
        };

        questions.push(question);
      } catch (error) {
        logger.warn(`Skipping row due to error: ${error.message}`);
      }
    }

    if (questions.length > 0) {
      await Question.insertMany(questions);
      res.status(201).json({
        message: 'Questions imported successfully',
        count: questions.length,
      });
    } else {
      res.status(400).json({ message: 'No valid questions to import' });
    }

    fs.unlinkSync(filePath);
  } catch (error) {
    logger.error('Error importing questions:', error);
    next(error);
  }
};

module.exports = {
  bulkImportQuestions,
  getQuestionsForEachCategory,
};
