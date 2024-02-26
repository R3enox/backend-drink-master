const setPagination = (page, perPage) => {
  if (isNaN(parseInt(page)) || page <= 0) page = 1;

  const skip = (page - 1) * perPage;
  return {
    skip,
    limit: Number(perPage),
  };
};

module.exports = setPagination;
