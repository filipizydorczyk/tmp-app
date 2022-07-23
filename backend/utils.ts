import sqlite3, { RunResult } from "sqlite3";

/**
 * Function to check if provided string is valid ISO formated date
 * @param str string to be checked
 * @returns boolean if string is ISO string or not
 */
export const isIsoDate = (str: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
};

/**
 * `page` - is current returned page
 *
 * `size` - how many elements are in page
 *
 * `pages` - amount of total pages
 *
 * `total` - amount of total elements
 *
 * `content` - array of current page content
 */
export type Page<Content> = {
  page: number;
  size: number;
  pages: number;
  total: number;
  content: Content[];
};

/**
 * Executes db query. This function is just a wrapper so that
 * we can call sqlites queries with await
 * @param db instance of sqlite3.Database to call a queru
 * @param sql string with query
 * @returns promise with result (just state no data)
 */
export const execute = async (db: sqlite3.Database, sql: string) => {
  return new Promise(async (resolve, reject) => {
    db.run(sql, (result: RunResult, err: Error | null) => {
      if (err) {
        resolve(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Executes db select queries. This function is just a wrapper so that
 * we can call sqlites queries with await
 * @param db instance of sqlite3.Database to call a queru
 * @param sql select string
 * @returns response with fetched data
 */
export const fetch = async (
  db: sqlite3.Database,
  sql: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
