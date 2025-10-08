/**
 * 测试模块
 * 用于验证各个模块的功能正确性
 */

import { converter } from './main.js';
import { parseMarkdown } from './markdownParser.js';
import { generateHtml } from './htmlGenerator.js';
import { readFile, writeFile } from './fileUtils.js';

/**
 * 测试用例类
 */
class TestCase {
    constructor(name, testFunction) {
        this.name = name;
        this.testFunction = testFunction;
    }
    
    async run() {
        try {
            console.log(`\n🧪 运行测试: ${this.name}`);
            await this.testFunction();
            console.log(`✅ 测试通过: ${this.name}`);
            return true;
        } catch (error) {
            console.error(`❌ 测试失败: ${this.name}`);
            console.error(`   错误: ${error.message}`);
            return false;
        }
    }
}

/**
 * 测试套件
 */
class TestSuite {
    constructor() {
        this.tests = [];
        this.passedCount = 0;
        this.failedCount = 0;
    }
    
    addTest(name, testFunction) {
        this.tests.push(new TestCase(name, testFunction));
    }
    
    async runAll() {
        console.log(`\n🚀 开始运行测试套件 (${this.tests.length} 个测试)\n`);
        
        for (const test of this.tests) {
            const passed = await test.run();
            if (passed) {
                this.passedCount++;
            } else {
                this.failedCount++;
            }
        }
        
        this.printSummary();
    }
    
    printSummary() {
        console.log(`\n📊 测试结果总结:`);
        console.log(`   ✅ 通过: ${this.passedCount}`);
        console.log(`   ❌ 失败: ${this.failedCount}`);
        console.log(`   📈 成功率: ${((this.passedCount / this.tests.length) * 100).toFixed(1)}%`);
        
        if (this.failedCount === 0) {
            console.log(`\n🎉 所有测试都通过了！`);
        } else {
            console.log(`\n⚠️  有 ${this.failedCount} 个测试失败，请检查代码。`);
        }
    }
}

/**
 * 断言函数
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || '断言失败');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `期望: ${expected}, 实际: ${actual}`);
    }
}

function assertContains(text, substring, message) {
    if (!text.includes(substring)) {
        throw new Error(message || `文本不包含: ${substring}`);
    }
}

/**
 * 具体的测试用例
 */
async function createTestSuite() {
    const suite = new TestSuite();
    
    // 测试Markdown解析器
    suite.addTest('Markdown解析器 - 标题解析', async () => {
        const markdown = '# 一级标题\n## 二级标题';
        const elements = parseMarkdown(markdown);
        
        assertEqual(elements.length, 2, '应该解析出2个元素');
        assertEqual(elements[0].type, 'h1', '第一个元素应该是h1');
        assertEqual(elements[0].content, '一级标题', '一级标题内容正确');
        assertEqual(elements[1].type, 'h2', '第二个元素应该是h2');
        assertEqual(elements[1].content, '二级标题', '二级标题内容正确');
    });
    
    suite.addTest('Markdown解析器 - 粗体和斜体', async () => {
        const markdown = '这是**粗体**和*斜体*文本';
        const elements = parseMarkdown(markdown);
        
        assertEqual(elements.length, 1, '应该解析出1个段落元素');
        assertEqual(elements[0].type, 'p', '应该是段落类型');
        assert(elements[0].children.length >= 3, '段落应该包含多个子元素');
    });
    
    suite.addTest('Markdown解析器 - 空输入处理', async () => {
        const elements1 = parseMarkdown('');
        const elements2 = parseMarkdown(null);
        const elements3 = parseMarkdown(undefined);
        
        assertEqual(elements1.length, 0, '空字符串应该返回空数组');
        assertEqual(elements2.length, 0, 'null应该返回空数组');
        assertEqual(elements3.length, 0, 'undefined应该返回空数组');
    });
    
    // 测试HTML生成器
    suite.addTest('HTML生成器 - 基本HTML生成', async () => {
        const elements = parseMarkdown('# 测试标题\n这是一个段落');
        const html = generateHtml(elements, { title: '测试文档' });
        
        assertContains(html, '<!DOCTYPE html>', '应该包含DOCTYPE');
        assertContains(html, '<h1>测试标题</h1>', '应该包含h1标签');
        assertContains(html, '<p>这是一个段落</p>', '应该包含p标签');
        assertContains(html, '<title>测试文档</title>', '应该包含标题');
    });
    
    suite.addTest('HTML生成器 - 特殊字符转义', async () => {
        const elements = parseMarkdown('# 标题<script>alert("test")</script>');
        const html = generateHtml(elements);
        
        assertContains(html, '&lt;script&gt;', '应该转义<符号');
        assertContains(html, '&quot;test&quot;', '应该转义引号');
        assert(!html.includes('<script>'), '不应该包含未转义的script标签');
    });
    
    // 测试完整转换流程
    suite.addTest('完整转换流程 - 文本转换', async () => {
        const markdown = `# 测试文档
        
## 子标题

这是一个包含**粗体**和*斜体*的段落。

另一个普通段落。`;

        const html = converter.convertText(markdown, { title: '集成测试' });
        
        assertContains(html, '<h1>测试文档</h1>', '应该正确转换一级标题');
        assertContains(html, '<h2>子标题</h2>', '应该正确转换二级标题');
        assertContains(html, '<strong>粗体</strong>', '应该正确转换粗体');
        assertContains(html, '<em>斜体</em>', '应该正确转换斜体');
        assertContains(html, '<title>集成测试</title>', '应该设置正确的标题');
    });
    
    // 测试文件操作
    suite.addTest('文件转换测试', async () => {
        // 创建测试输入文件
        const testMarkdown = `# 文件测试
        
这是一个文件转换测试。

## 功能验证

包含**粗体**和*斜体*文本。`;
        
        const inputPath = 'lab1/test-input.md';
        const outputPath = 'lab1/test-output.html';
        
        // 写入测试文件
        await writeFile(inputPath, testMarkdown);
        
        // 执行转换
        const resultPath = await converter.convertFile(inputPath, outputPath);
        
        // 验证输出
        assertEqual(resultPath, outputPath, '应该返回正确的输出路径');
        
        const outputContent = await readFile(outputPath);
        assertContains(outputContent, '<h1>文件测试</h1>', '输出文件应该包含转换后的内容');
        assertContains(outputContent, '<strong>粗体</strong>', '输出文件应该包含格式化文本');
    });
    
    return suite;
}

/**
 * 主测试函数
 */
async function runTests() {
    console.log('🔧 Markdown到HTML转换器 - 测试套件');
    console.log('=====================================');
    
    try {
        const suite = await createTestSuite();
        await suite.runAll();
        
        if (suite.failedCount > 0) {
            process.exit(1);
        }
    } catch (error) {
        console.error('测试运行失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests };