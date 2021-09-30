export const isGenericCategory = (categoriesIdList = []) => {
    return categoriesIdList
      ?.map((categoryId) => parseInt(categoryId))
      .includes(7);
  };