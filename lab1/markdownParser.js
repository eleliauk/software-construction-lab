/**
 * Markdown解析模块
 * 职责：将Markdown文本解析为结构化的数据
 * 高内聚：所有Markdown解析相关的逻辑都在这个模块中
 * 低耦合：只依赖输入的文本，输出标准化的数据结构
 */

/**
 * 解析后的内容元素类型
 */
export const ElementType = {
    H1: 'h1',
    H2: 'h2',
    STRONG: 'strong',
    EM: 'em',
    PARAGRAPH: 'p'
};

/**
 * 表示解析后的内容元素
 */
class ParsedElement {
    constructor(type, content, children = []) {
        this.type = type;
        this.content = content;
        this.children = children;
    }
}

/**
 * Markdown解析器类
 * 封装所有解析逻辑，对外提供简洁的接口
 */
class MarkdownParser {
    
    /**
     * 解析Markdown文本为结构化数据
     * @param {string} markdownText - Markdown文本
     * @returns {ParsedElement[]} 解析后的元素数组
     */
    parse(markdownText) {
        if (!markdownText || typeof markdownText !== 'string') {
            return [];
        }

        const lines = markdownText.split('\n');
        const elements = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // 跳过空行
            if (!trimmedLine) {
                continue;
            }

            const element = this._parseLine(trimmedLine);
            if (element) {
                elements.push(element);
            }
        }

        return elements;
    }

    /**
     * 解析单行内容（私有方法）
     * @param {string} line - 要解析的行
     * @returns {ParsedElement|null} 解析后的元素
     * @private
     */
    _parseLine(line) {
        // 解析标题
        if (line.startsWith('# ')) {
            return new ParsedElement(ElementType.H1, line.substring(2));
        }
        
        if (line.startsWith('## ')) {
            return new ParsedElement(ElementType.H2, line.substring(3));
        }

        // 解析普通段落（可能包含内联格式）
        const parsedContent = this._parseInlineElements(line);
        return new ParsedElement(ElementType.PARAGRAPH, '', parsedContent);
    }

    /**
     * 解析内联元素（粗体、斜体）（私有方法）
     * @param {string} text - 要解析的文本
     * @returns {ParsedElement[]} 解析后的内联元素数组
     * @private
     */
    _parseInlineElements(text) {
        const elements = [];
        let remaining = text;
        
        while (remaining.length > 0) {
            // 首先处理粗体 **text**
            const boldIndex = remaining.indexOf('**');
            if (boldIndex !== -1) {
                // 查找粗体的结束标记
                const boldEndIndex = remaining.indexOf('**', boldIndex + 2);
                if (boldEndIndex !== -1) {
                    // 添加粗体前的文本
                    if (boldIndex > 0) {
                        const beforeText = remaining.substring(0, boldIndex);
                        elements.push(...this._parseSimpleInline(beforeText));
                    }
                    
                    // 添加粗体文本
                    const boldContent = remaining.substring(boldIndex + 2, boldEndIndex);
                    elements.push(new ParsedElement(ElementType.STRONG, boldContent));
                    
                    // 继续处理剩余文本
                    remaining = remaining.substring(boldEndIndex + 2);
                    continue;
                }
            }
            
            // 如果没有粗体，处理斜体 *text*
            const italicIndex = remaining.indexOf('*');
            if (italicIndex !== -1) {
                // 查找斜体的结束标记
                const italicEndIndex = remaining.indexOf('*', italicIndex + 1);
                if (italicEndIndex !== -1) {
                    // 添加斜体前的文本
                    if (italicIndex > 0) {
                        const beforeText = remaining.substring(0, italicIndex);
                        elements.push(new ParsedElement('text', beforeText));
                    }
                    
                    // 添加斜体文本
                    const italicContent = remaining.substring(italicIndex + 1, italicEndIndex);
                    elements.push(new ParsedElement(ElementType.EM, italicContent));
                    
                    // 继续处理剩余文本
                    remaining = remaining.substring(italicEndIndex + 1);
                    continue;
                }
            }
            
            // 如果没有任何格式标记，添加所有剩余文本
            elements.push(new ParsedElement('text', remaining));
            break;
        }
        
        return elements;
    }
    
    /**
     * 解析简单的内联元素（只处理斜体）（私有方法）
     * @param {string} text - 要解析的文本
     * @returns {ParsedElement[]} 解析后的内联元素数组
     * @private
     */
    _parseSimpleInline(text) {
        const elements = [];
        let remaining = text;
        
        while (remaining.length > 0) {
            const italicIndex = remaining.indexOf('*');
            if (italicIndex !== -1) {
                const italicEndIndex = remaining.indexOf('*', italicIndex + 1);
                if (italicEndIndex !== -1) {
                    // 添加斜体前的文本
                    if (italicIndex > 0) {
                        elements.push(new ParsedElement('text', remaining.substring(0, italicIndex)));
                    }
                    
                    // 添加斜体文本
                    const italicContent = remaining.substring(italicIndex + 1, italicEndIndex);
                    elements.push(new ParsedElement(ElementType.EM, italicContent));
                    
                    // 继续处理剩余文本
                    remaining = remaining.substring(italicEndIndex + 1);
                    continue;
                }
            }
            
            // 没有更多斜体标记
            elements.push(new ParsedElement('text', remaining));
            break;
        }
        
        return elements;
    }

    /**
     * 查找匹配的模式（私有方法）
     * @param {string} text - 文本
     * @param {number} startPos - 开始位置
     * @param {RegExp} pattern - 正则表达式模式
     * @returns {Object|null} 匹配结果
     * @private
     */
    _findPattern(text, startPos, pattern) {
        const searchText = text.substring(startPos);
        const match = searchText.match(pattern);
        
        if (!match) {
            return null;
        }

        const isBold = pattern.source.includes('\\*\\*');
        const elementType = isBold ? ElementType.STRONG : ElementType.EM;
        
        return {
            index: startPos + match.index,
            length: match[0].length,
            element: new ParsedElement(elementType, match[1])
        };
    }
}

/**
 * 创建Markdown解析器实例
 * @returns {MarkdownParser} 解析器实例
 */
export function createParser() {
    return new MarkdownParser();
}

/**
 * 便捷的解析函数
 * @param {string} markdownText - Markdown文本
 * @returns {ParsedElement[]} 解析后的元素数组
 */
export function parseMarkdown(markdownText) {
    const parser = createParser();
    return parser.parse(markdownText);
}