const setPagination = (page, perPage) => {
  const skip = (page - 1) * perPage;

  return {
    skip,
    limit: Number(perPage),
  };
};

module.exports = setPagination;
