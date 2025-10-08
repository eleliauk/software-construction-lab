/**
 * 文件I/O模块
 * 职责：处理文件的读取和写入操作
 * 高内聚：所有文件操作相关的功能都在这个模块中
 * 低耦合：通过明确的接口提供服务，不依赖其他业务模块
 */

import fs from 'fs';
import path from 'path';

/**
 * 读取文件内容
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} 文件内容
 * @throws {Error} 文件读取失败时抛出错误
 */
export async function readFile(filePath) {
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        throw new Error(`读取文件失败: ${filePath} - ${error.message}`);
    }
}

/**
 * 写入文件内容
 * @param {string} filePath - 文件路径
 * @param {string} content - 要写入的内容
 * @returns {Promise<void>}
 * @throws {Error} 文件写入失败时抛出错误
 */
export async function writeFile(filePath, content) {
    try {
        // 确保目录存在
        const dir = path.dirname(filePath);
        await fs.promises.mkdir(dir, { recursive: true });
        
        await fs.promises.writeFile(filePath, content, 'utf8');
    } catch (error) {
        throw new Error(`写入文件失败: ${filePath} - ${error.message}`);
    }
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * 获取文件扩展名
 * @param {string} filePath - 文件路径
 * @returns {string} 文件扩展名（小写）
 */
export function getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase();
}

/**
 * 生成输出文件路径
 * @param {string} inputPath - 输入文件路径
 * @param {string} newExtension - 新的文件扩展名
 * @returns {string} 输出文件路径
 */
export function generateOutputPath(inputPath, newExtension) {
    const parsed = path.parse(inputPath);
    return path.join(parsed.dir, parsed.name + newExtension);
}