const express = require('express');
const path = require('path');
const winston = require('winston');
const app = express();
const PORT = 3000;

// --- 配置 Winston 日志记录器 ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: 'traffic.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],
    // 处理未捕获的异常
    exceptionHandlers: [
        new winston.transports.File({ filename: 'traffic.log' })
    ],
    // 处理未处理的 Promise 拒绝
    rejectionHandlers: [
        new winston.transports.File({ filename: 'traffic.log' })
    ]
});

// 确保日志文件可以立即写入
logger.on('error', (error) => {
    console.error('Winston logger error:', error);
});

// --- 中间件 ---
// 1. 允许服务器解析 JSON 请求体
app.use(express.json());
// 2. 请求日志记录中间件 (仅记录 API 请求)
app.use('/api', (req, res, next) => {
    const startTime = Date.now();
    
    const logData = {
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        body: req.body,
        timestamp: new Date().toISOString()
    };
    
    // 记录请求
    logger.info('API Request', logData);
    console.log(`[日志] ${req.method} ${req.url} - 已记录到 traffic.log`);
    
    // 记录响应状态（当响应完成时）
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info('API Response', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });
    });
    
    next();
});
// 3. 托管 'public' 文件夹中的所有静态文件 (例如 index.html)
app.use(express.static(path.join(__dirname, 'public')));

// --- 内存数据库 (Collection) ---
let todos = [
    { id: 1, text: "学习 Node.js", completed: true },
    { id: 2, text: "创建全栈应用", completed: false }
];
let nextId = 3; // 用于生成下一个 ID
let secretKey = 'your-secret-key';

// --- API 路由 (Backend) ---

// GET /api/todos - 获取所有待办事项
app.get('/api/todos', (req, res) => {
    res.json({
        todos: todos,
        secretKey: secretKey
    });
});

// POST /api/todos - 添加 (Add) 新的待办事项
app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: nextId++,
        text: req.body.text,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PUT /api/todos/:id - 修改 (Edit) 待办事项
// (我们将使用 PUT 来切换 'completed' 状态或更新文本)
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { text, completed } = req.body;

    const todo = todos.find(t => t.id === id);

    if (todo) {
        // 如果请求中提供了 'text'，则更新它
        if (text !== undefined) {
            todo.text = text;
        }
        // 如果请求中提供了 'completed'，则更新它
        if (completed !== undefined) {
            todo.completed = completed;
        }
        res.json(todo);
    } else {
        res.status(404).json({ error: "Todo not found" });
    }
});

// DELETE /api/todos/:id - 删除 (Delete) 待办事项
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index !== -1) {
        todos.splice(index, 1); // 从数组中移除
        res.status(204).send(); // 204 No Content
    } else {
        res.status(404).json({ error: "Todo not found" });
    }
});

// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`[信息] 服务器已在 http://localhost:${PORT} 上运行`);
    // 测试日志记录器是否正常工作
    logger.info('Server started', { port: PORT, timestamp: new Date().toISOString() });
    console.log('[信息] 日志记录器已初始化，日志将写入 traffic.log');
});