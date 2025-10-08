/**
 * HTML生成模块
 * 职责：将解析后的结构化数据转换为HTML格式
 * 高内聚：所有HTML生成相关的逻辑都在这个模块中
 * 低耦合：只依赖标准化的数据结构，不依赖具体的解析实现
 */

import { ElementType } from './markdownParser.js';

/**
 * HTML生成器类
 * 封装所有HTML生成逻辑，支持不同的输出格式
 */
class HtmlGenerator {
    
    /**
     * 将解析后的元素数组转换为完整的HTML文档
     * @param {Array} elements - 解析后的元素数组
     * @param {Object} options - 生成选项
     * @returns {string} 完整的HTML文档
     */
    generateDocument(elements, options = {}) {
        const title = options.title || 'Markdown转换结果';
        const includeDoctype = options.includeDoctype !== false;
        const includeMetadata = options.includeMetadata !== false;
        
        const bodyContent = this.generateBody(elements);
        
        let html = '';
        
        if (includeDoctype) {
            html += '<!DOCTYPE html>\n';
        }
        
        html += '<html lang="zh-CN">\n';
        html += '<head>\n';
        
        if (includeMetadata) {
            html += '    <meta charset="UTF-8">\n';
            html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        }
        
        html += `    <title>${this._escapeHtml(title)}</title>\n`;
        html += this._generateDefaultStyles();
        html += '</head>\n';
        html += '<body>\n';
        html += this._indentContent(bodyContent, 1);
        html += '</body>\n';
        html += '</html>';
        
        return html;
    }
    
    /**
     * 生成HTML文档的主体内容
     * @param {Array} elements - 解析后的元素数组
     * @returns {string} HTML主体内容
     */
    generateBody(elements) {
        if (!elements || !Array.isArray(elements)) {
            return '';
        }
        
        return elements.map(element => this._generateElement(element)).join('\n');
    }
    
    /**
     * 生成单个元素的HTML（私有方法）
     * @param {Object} element - 元素对象
     * @returns {string} 元素的HTML表示
     * @private
     */
    _generateElement(element) {
        if (!element || !element.type) {
            return '';
        }
        
        switch (element.type) {
            case ElementType.H1:
                return `<h1>${this._escapeHtml(element.content)}</h1>`;
                
            case ElementType.H2:
                return `<h2>${this._escapeHtml(element.content)}</h2>`;
                
            case ElementType.STRONG:
                return `<strong>${this._escapeHtml(element.content)}</strong>`;
                
            case ElementType.EM:
                return `<em>${this._escapeHtml(element.content)}</em>`;
                
            case ElementType.PARAGRAPH:
                return `<p>${this._generateInlineContent(element.children)}</p>`;
                
            case 'text':
                return this._escapeHtml(element.content);
                
            default:
                return '';
        }
    }
    
    /**
     * 生成内联内容的HTML（私有方法）
     * @param {Array} children - 子元素数组
     * @returns {string} 内联内容的HTML
     * @private
     */
    _generateInlineContent(children) {
        if (!children || !Array.isArray(children)) {
            return '';
        }
        
        return children.map(child => this._generateElement(child)).join('');
    }
    
    /**
     * HTML转义（私有方法）
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     * @private
     */
    _escapeHtml(text) {
        if (typeof text !== 'string') {
            return '';
        }
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    /**
     * 生成默认样式（私有方法）
     * @returns {string} CSS样式
     * @private
     */
    _generateDefaultStyles() {
        return `    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        h1, h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 0.5em;
        }
        h2 {
            font-size: 2em;
            margin-bottom: 0.5em;
        }
        p {
            margin-bottom: 1em;
            text-align: justify;
        }
        strong {
            color: #e74c3c;
            font-weight: bold;
        }
        em {
            color: #8e44ad;
            font-style: italic;
        }
    </style>
`;
    }
    
    /**
     * 为内容添加缩进（私有方法）
     * @param {string} content - 内容
     * @param {number} level - 缩进级别
     * @returns {string} 缩进后的内容
     * @private
     */
    _indentContent(content, level) {
        const indent = '    '.repeat(level);
        return content.split('\n')
            .map(line => line.trim() ? indent + line : line)
            .join('\n');
    }
}

/**
 * 创建HTML生成器实例
 * @returns {HtmlGenerator} 生成器实例
 */
export function createGenerator() {
    return new HtmlGenerator();
}

/**
 * 便捷的HTML生成函数
 * @param {Array} elements - 解析后的元素数组
 * @param {Object} options - 生成选项
 * @returns {string} HTML文档
 */
export function generateHtml(elements, options = {}) {
    const generator = createGenerator();
    return generator.generateDocument(elements, options);
}

/**
 * 生成简单的HTML片段（不包含完整文档结构）
 * @param {Array} elements - 解析后的元素数组
 * @returns {string} HTML片段
 */
export function generateHtmlFragment(elements) {
    const generator = createGenerator();
    return generator.generateBody(elements);
}