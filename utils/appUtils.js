const { removeAccents } = require('../utils/stringUtils');

module.exports = {
  preprocessingHandleFilter: (filter) => {
    if (filter.searchText && filter.searchField) {
      filter[filter.searchField] = { '$regex': removeAccents(filter.searchText), '$options': '$i' };
      delete filter.searchText;
      delete filter.searchField;
    }
    if (filter.createdDate) {
      if (filter.createdDate['$gte']) {
        filter.createdDate['$gte'] = new Date(filter.createdDate['$gte']);
      }
      if (filter.createdDate['$lte']) {
        filter.createdDate['$lte'] = new Date(filter.createdDate['$lte']);
      }
      if (filter.createdDate['$gt']) {
        filter.createdDate['$gt'] = new Date(filter.createdDate['$gt']);
      }
      if (filter.createdDate['$lt']) {
        filter.createdDate['$lt'] = new Date(filter.createdDate['$lt']);
      }
    }
    if (filter.updatedDate) {
      if (filter.updatedDate['$gte']) {
        filter.updatedDate['$gte'] = new Date(filter.updatedDate['$gte']);
      }
      if (filter.updatedDate['$lte']) {
        filter.updatedDate['$lte'] = new Date(filter.updatedDate['$lte']);
      }
      if (filter.updatedDate['$gt']) {
        filter.updatedDate['$gt'] = new Date(filter.updatedDate['$gt']);
      }
      if (filter.updatedDate['$lt']) {
        filter.updatedDate['$lt'] = new Date(filter.updatedDate['$lt']);
      }
    }
    return filter;
  }
};