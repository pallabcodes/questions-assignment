const { Category } = require('../models');

const getAllCategories = async function (req, res, next) {
  let { pageNumber, pageSize } = req.query;

  try {
    pageNumber = parseInt(pageNumber, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 50;

    const pipeline = [
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [
            { $sort: { name: 1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                __v: 0,
              },
            },
          ],
        },
      },
    ];

    const categories = await Category.aggregate(pipeline);

    const totalItems = categories[0].metadata[0].totalCount;

    res.status(200).json({
      data: categories[0].data,
      pagination: {
        totalCount: totalItems,
        perPage: pageSize,
        currentPage: pageNumber,
        lastPage: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id, { __v: 0 });

    if (!category) {
      return res
        .status(404)
        .json({ message: 'Category not found', data: null });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    // BELOW IF CONDITION TO BE REFACTORED LATE FOR MORE CLARITY AND POSSIBLE REUSES ELSEWHERE
    if (
      error.kind === 'ObjectId' &&
      error.path === '_id' &&
      error.name === 'CastError'
    ) {
      return res.status(400).json({ message: 'Provide a valid category id' });
    }

    // OTHERWISE, JUST PASS THE ERROR NEXT ERROR HANDLING MIDDLEWARE i.e. errorMiddleware

    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
};
