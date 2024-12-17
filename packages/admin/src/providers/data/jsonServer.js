
import isObject from "lodash/isObject"

import {
  GET_LIST,
  GET_LIST_ALL,
  GET_MANY,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_ROW,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  COPY,
  COPY_MANY
} from "./actions";

import FetchJson from "../utils/fetchJson";
import qs from "qs";

export default (httpClient) => {
  if (typeof httpClient === "string") {
    httpClient = new FetchJson(httpClient);
  }

  const withInclude = (params) => {
    let query = {};

    if (params.include) {
      let { embed, expand } = params.include;
      query = {
        _embed: embed,
        _expand: expand,
      };
    }

    return query;
  };

  return {
    [GET_LIST]: async (resource, params) => {
        const { pagination, sort, filter } = params;

        // if the filter has array lets write them
        // in query string array format ["key"] = value
        // 
        var newFilter = {}

        if (isObject(filter)) {
          for (const [key, value] of Object.entries(filter)) {
              if (Array.isArray(value)) {
                  newFilter[key + "[]"] = value  
              } else {
                  newFilter[key] = value
              }
          }    
        }
        let query = {
            ...withInclude(params),
            ...newFilter,
        }

        if (params.defaultQueryString) {
            query = {
              ...query,
              ...params.defaultQueryString
            }
        }
        
        // console.log(params)
        // console.log(params)

        if (pagination) {
        let { page, perPage } = pagination;
            query = {
              ...query,
              _perPage: perPage,
              _page: page,
              // _start: (page - 1) * perPage,
              // _end: page * perPage,
            }
        }

        if (sort && sort.length) {
            query = {
              ...query,
              "_sort[]": sort.map((item) => item.by),
              "_order[]": sort.map((item) => (item.desc ? "desc" : "asc")),
            }
        }
        let response = await httpClient.get(
            `${resource}/findAllByPaging?${qs.stringify(query, { arrayFormat: "repeat" })}`
        );
        if (response && response["data"]) {
          let { data, headers } = response;
          return {
              data,
              total: parseInt(headers["x-total-count"], 10),
          };
        }
        return {
          data: null,
          total: 0,
        };
    },
    [GET_LIST_ALL]: async (resource, params) => {

      const { filter } = params;

      if (typeof params.ids != 'undefined') {
          for (const val of params.ids) {
              filter["id[]"] = val.id
          }
      }
      let query = {
        ...withInclude(params),
        ...filter,
      };
      let response = await httpClient.get(
        `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`
      );
      if (response && response["data"]) {
        let { data, headers } = response;
        return {
          data,
          total: parseInt(headers["x-total-count"], 10),
        };  
      }
      return {
        data: null,
        total: 0,
      };
    },

    [GET_MANY]: async (resource, params) => {

      const { filter } = params;

      var newFilter = {}
      for (const [key, value] of Object.entries(filter)) {
          if (isObject(value)) {
            for (const property in value) {
              newFilter[property + "[]"] = value[property]
            }
          }
          if (Array.isArray(value)) {
              newFilter[key + "[]"] = value  
          } 
      }
      let query = {
          ...withInclude(params),
          ...newFilter,
      }

      return httpClient.get(
          `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`
      )

      // const { filter } = params;

      // let query = {
      //     ...withInclude(params),
      //     ...filter,
      // }
      // return httpClient.get(
      //     `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`
        // )
    },
    [GET_ONE]: async (resource, params) => {
      let response = await httpClient.get(
        `${resource}/findOneById/${params.id}?${qs.stringify(withInclude(params))}`
      )
      if (response && response["data"]) {
        let { data } = response;
        return data;
      }
    },
    [CREATE]: (resource, params) => httpClient.post(`${resource}/create`, params.data),
    [UPDATE]: (resource, params) =>
      httpClient.put(`${resource}/update/${params.id}`, params.data),
    [UPDATE_ROW]: (resource, params) =>
      httpClient.put(`${resource}/updateRow/${params.id}`, params.data),
    [UPDATE_MANY]: (resource, params) =>
      Promise.all(
        params.ids.map((id) => httpClient.put(`${resource}/update/${id}`, params.data))
      ).then(() => Promise.resolve()),

    [DELETE]: (resource, params) => {
      if (params['query'] && typeof params['query'] === 'object') {
        const queryString = Object.entries(params['query']).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
        httpClient.delete(`${resource}/delete/${params.id}?` + queryString);
      } else {
        httpClient.delete(`${resource}/delete/${params.id}`);  
      }
    },

    [DELETE_MANY]: (resource, params) =>
      Promise.all(
        params.ids.map((id) => httpClient.delete(`${resource}/delete/${id}`))
      ).then(() => Promise.resolve()),

    [COPY]: (resource, params) =>
      httpClient.post(`${resource}/copy/${params.id}`, params.data),
    [COPY_MANY]: (resource, params) =>
      Promise.all(
        params.ids.map((id) => httpClient.post(`${resource}/copy/${id}`, params.data))
      ).then(() => Promise.resolve()),
      
  };
};
