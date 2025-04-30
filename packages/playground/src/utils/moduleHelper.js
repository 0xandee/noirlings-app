/**
 * Helper utility to handle ES modules in Node.js
 * 
 * This file provides utility functions for working with ES modules in Node.js,
 * especially for code that needs to work with both CommonJS and ES modules.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Get the current file's directory path in ES module context
 * @param {string} importMetaUrl - The import.meta.url value
 * @returns {string} The directory path
 */
export const getDirname = (importMetaUrl) => {
    const filename = fileURLToPath(importMetaUrl);
    return dirname(filename);
};

/**
 * Join paths relative to the current file's directory
 * @param {string} importMetaUrl - The import.meta.url value
 * @param {...string} paths - Paths to join
 * @returns {string} The joined path
 */
export const joinPath = (importMetaUrl, ...paths) => {
    const dirPath = getDirname(importMetaUrl);
    return join(dirPath, ...paths);
}; 