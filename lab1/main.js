/**
 * 主程序模块
 * 职责：协调各个模块，实现完整的转换流程
 * 低耦合：通过模块接口调用，不直接依赖具体实现
 */

import { readFile, writeFile, fileExists, getFileExtension, generateOutputPath } from './fileUtils.js';
import { parseMarkdown } from './markdownParser.js';
import { generateHtml } from './htmlGenerator.js';

/**
 * Markdown到HTML转换器类
 * 协调各个模块完成转换任务
 */
class MarkdownToHtmlConverter {
    
    /**
     * 转换Markdown文件为HTML文件
     * @param {string} inputPath - 输入的Markdown文件路径
     * @param {string} outputPath - 输出的HTML文件路径（可选）
     * @param {Object} options - 转换选项
     * @returns {Promise<string>} 输出文件路径
     */
    async convertFile(inputPath, outputPath = null, options = {}) {
        try {
            // 1. 验证输入文件
            await this._validateInputFile(inputPath);
            
            // 2. 读取Markdown文件
            console.log(`正在读取文件: ${inputPath}`);
            const markdownContent = await readFile(inputPath);
            
            // 3. 解析Markdown内容
            console.log('正在解析Markdown内容...');
            const parsedElements = parseMarkdown(markdownContent);
            
            // 4. 生成HTML内容
            console.log('正在生成HTML内容...');
            const htmlOptions = {
                title: options.title || `Markdown转换结果 - ${inputPath}`,
                includeDoctype: options.includeDoctype,
                includeMetadata: options.includeMetadata
            };
            const htmlContent = generateHtml(parsedElements, htmlOptions);
            
            // 5. 确定输出路径
            const finalOutputPath = outputPath || generateOutputPath(inputPath, '.html');
            
            // 6. 写入HTML文件
            console.log(`正在写入文件: ${finalOutputPath}`);
            await writeFile(finalOutputPath, htmlContent);
            
            console.log(`转换完成! 输出文件: ${finalOutputPath}`);
            return finalOutputPath;
            
        } catch (error) {
            throw new Error(`转换失败: ${error.message}`);
        }
    }
    
    /**
     * 直接转换Markdown文本为HTML
     * @param {string} markdownText - Markdown文本
     * @param {Object} options - 转换选项
     * @returns {string} HTML内容
     */
    convertText(markdownText, options = {}) {
        try {
            // 解析Markdown内容
            const parsedElements = parseMarkdown(markdownText);
            
            // 生成HTML内容
            const htmlOptions = {
                title: options.title || 'Markdown转换结果',
                includeDoctype: options.includeDoctype,
                includeMetadata: options.includeMetadata
            };
            
            return generateHtml(parsedElements, htmlOptions);
            
        } catch (error) {
            throw new Error(`文本转换失败: ${error.message}`);
        }
    }
    
    /**
     * 验证输入文件（私有方法）
     * @param {string} inputPath - 输入文件路径
     * @private
     */
    async _validateInputFile(inputPath) {
        if (!inputPath) {
            throw new Error('请提供输入文件路径');
        }
        
        const exists = await fileExists(inputPath);
        if (!exists) {
            throw new Error(`文件不存在: ${inputPath}`);
        }
        
        const extension = getFileExtension(inputPath);
        if (extension !== '.md') {
            throw new Error(`不支持的文件格式: ${extension}，请提供.md文件`);
        }
    }
}

/**
 * 命令行参数解析
 * @returns {Object} 解析后的参数
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        return null;
    }
    
    const config = {
        inputPath: args[0],
        outputPath: args[1] || null,
        options: {}
    };
    
    // 解析选项参数
    for (let i = 2; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--no-doctype') {
            config.options.includeDoctype = false;
        } else if (arg === '--no-metadata') {
            config.options.includeMetadata = false;
        } else if (arg.startsWith('--title=')) {
            config.options.title = arg.substring(8);
        }
    }
    
    return config;
}

/**
 * 显示使用帮助
 */
function showHelp() {
    console.log(`
Markdown到HTML转换器

用法:
  node main.js <输入文件.md> [输出文件.html] [选项]

参数:
  输入文件.md     要转换的Markdown文件路径
  输出文件.html   输出的HTML文件路径（可选，默认为输入文件名.html）

选项:
  --title=标题    设置HTML文档标题
  --no-doctype   不包含DOCTYPE声明
  --no-metadata  不包含meta标签

示例:
  node main.js example.md
  node main.js example.md output.html
  node main.js example.md output.html --title=我的文档
  node main.js example.md --no-doctype --no-metadata

支持的Markdown语法:
  # 标题          -> <h1>标题</h1>
  ## 标题         -> <h2>标题</h2>
  **粗体**        -> <strong>粗体</strong>
  *斜体*          -> <em>斜体</em>
  普通段落        -> <p>普通段落</p>
`);
}

/**
 * 主函数
 */
async function main() {
    try {
        const config = parseCommandLineArgs();
        
        if (!config) {
            showHelp();
            return;
        }
        
        const converter = new MarkdownToHtmlConverter();
        await converter.convertFile(config.inputPath, config.outputPath, config.options);
        
    } catch (error) {
        console.error(`错误: ${error.message}`);
        process.exit(1);
    }
}

// 创建转换器实例供其他模块使用
export const converter = new MarkdownToHtmlConverter();

// 导出转换器类
export { MarkdownToHtmlConverter };

// 如果直接运行此文件，执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}