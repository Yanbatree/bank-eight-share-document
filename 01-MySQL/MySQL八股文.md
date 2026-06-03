# MySQL 八股文

---

## 一、索引

### 1. 索引的底层数据结构是什么？为什么用 B+ 树？

MySQL InnoDB 默认使用 **B+ 树**。

- **B+ 树 vs 哈希**：哈希只支持等值查询，不支持范围查询和排序；B+ 树范围查询效率高
- **B+ 树 vs 二叉搜索树**：二叉树高度太高，导致 IO 次数多
- **B+ 树 vs B 树**：B+ 树非叶子节点不存数据，单个节点能放更多索引键，树更矮；叶子节点形成有序双向链表，范围查询和排序遍历只需扫描叶子链表即可

### 2. 聚簇索引和非聚簇索引的区别？

- **聚簇索引**：叶子节点存放的是**整行数据**。一张表只能有一个聚簇索引（一般是主键）
- **非聚簇索引（二级索引）**：叶子节点存放的是**主键值**。查询时需要**回表**——先用二级索引找到主键，再到聚簇索引找完整行

InnoDB 中主键索引就是聚簇索引；如果没有主键，选唯一非空索引；都没有则自动生成隐藏的 row_id。

### 3. 什么是回表？怎么避免？

回表：通过二级索引查到主键后，再到聚簇索引中查完整数据的过程。

**避免手段 = 覆盖索引**：查询的列都在索引中，不需要回表。

```sql
-- 假设有联合索引 (name, age)
SELECT name, age FROM user WHERE name = '张三';  -- 覆盖索引，不回表
```

### 4. 最左前缀原则是什么？

联合索引 (a, b, c) 相当于创建了 (a)、(a,b)、(a,b,c) 三个索引。

- `WHERE a=1` → 走索引
- `WHERE a=1 AND b=2` → 走索引
- `WHERE b=2` → **不走索引**（跳过了 a）
- `WHERE a=1 AND c=3` → 只用到 a（b 断了）

**为什么会这样**：联合索引按顺序排列，跳过最左列就无法二分查找定位。

### 5. 索引失效的场景有哪些？

- 查询条件中使用 `!=`、`<>`
- `LIKE` 以 `%` 开头（`LIKE '%abc'`）
- 对索引列使用函数或运算（`WHERE YEAR(create_time) = 2024`）
- 隐式类型转换（字符串列用数字查：`WHERE phone = 13800138000`）
- OR 条件中有一个列没索引
- 联合索引不满足最左前缀

### 6. 索引下推是什么？

MySQL 5.6+ 的特性。在联合索引扫描时，把 WHERE 条件中能判断的先在存储引擎层过滤掉，减少回表次数。

```sql
-- 联合索引 (name, age)
SELECT * FROM user WHERE name LIKE '张%' AND age = 20;
```
没有索引下推：找到 name 以"张"开头的全部回表，然后筛选 age=20。
有索引下推：在索引中就判断 age=20，只回表符合条件的行。

---

## 二、事务与锁

### 1. 事务四大特性（ACID）

| 特性 | 说明 |
|------|------|
| 原子性 (Atomicity) | 事务不可分割，要么全做要么全不做。由 **undo log** 保证 |
| 一致性 (Consistency) | 事务前后数据完整性约束不变。由其他三个特性共同保证 |
| 隔离性 (Isolation) | 并发事务之间互不干扰。由 **MVCC + 锁** 保证 |
| 持久性 (Durability) | 事务提交后数据永久保存。由 **redo log** 保证 |

### 2. 事务并发问题有哪些？

| 问题 | 描述 |
|------|------|
| 脏读 | 读到另一个事务**未提交**的数据 |
| 不可重复读 | 同一事务两次读到**同一行**数据**内容不同**（被其他事务 UPDATE 了） |
| 幻读 | 同一事务两次查询**行数不同**（被其他事务 INSERT/DELETE 了） |

### 3. 四种隔离级别

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|----------|------|-----------|------|
| READ UNCOMMITTED | ✓ | ✓ | ✓ |
| READ COMMITTED | ✗ | ✓ | ✓ |
| REPEATABLE READ（InnoDB 默认） | ✗ | ✗ | ✗（MVCC 基本解决） |
| SERIALIZABLE | ✗ | ✗ | ✗ |

InnoDB 的 RR 级别通过 **MVCC（快照读）+ Next-Key Lock（当前读）** 基本解决了幻读。

### 4. MVCC 原理

**多版本并发控制**，核心组件：
- **undo log 版本链**：每行数据有 trx_id（事务ID）和 roll_pointer（回滚指针），形成版本链
- **ReadView**：记录当前活跃事务列表，判断哪个版本可见

**可见性规则**：
- trx_id < 最小活跃事务ID → 已提交，可见
- trx_id > 最大活跃事务ID → 未开始，不可见
- 在活跃列表中 → 未提交，不可见

RC 级别：每次 SELECT 都生成新的 ReadView。
RR 级别：事务中第一次 SELECT 生成 ReadView，之后复用。

### 5. 行锁有哪些类型？

| 锁类型 | 说明 |
|--------|------|
| Record Lock | 锁定单条索引记录 |
| Gap Lock | 锁定索引记录之间的间隙（防止 INSERT） |
| Next-Key Lock | Record Lock + Gap Lock，左开右闭区间 |

**注意**：Gap Lock 只在 RR 级别下生效。如果 WHERE 条件未命中索引，行锁会**升级为表锁**。

### 6. 死锁怎么发生的？怎么解决？

**典型场景**：两个事务相互等待对方持有的锁。

```
事务A：UPDATE user SET age=20 WHERE id=1; → 持有 id=1 的锁，等待 id=2
事务B：UPDATE user SET age=30 WHERE id=2; → 持有 id=2 的锁，等待 id=1
```

**解决**：
- 按相同顺序访问资源
- 合理设计索引，减少锁范围
- 缩短事务
- MySQL 有死锁检测机制（`innodb_deadlock_detect`），检测到后回滚代价小的事务

---

## 三、日志

### 1. redo log 和 undo log 的区别？

| | redo log | undo log |
|---|----------|----------|
| 作用 | 保证**持久性**，崩溃恢复 | 保证**原子性**，事务回滚 + MVCC |
| 记录内容 | 物理日志："对哪个页做了什么修改" | 逻辑日志："修改前的数据" |
| 写入时机 | 事务执行过程中写入 redo log buffer，提交时刷盘 | 修改数据前先写 undo log |
| 存储位置 | redo log file（循环写） | undo log 在表空间中 |

### 2. WAL 是什么？

**Write-Ahead Logging**：先写日志再写磁盘。

更新数据时，InnoDB 先将修改记录到 redo log，返回成功，后续再由后台线程将脏页刷到磁盘。崩溃恢复时通过 redo log 重放。

### 3. binlog 和 redo log 的区别？

| | binlog | redo log |
|---|--------|----------|
| 层级 | Server 层，所有引擎通用 | InnoDB 引擎层 |
| 内容 | 逻辑日志（SQL 语句或行变更） | 物理日志 |
| 用途 | 主从复制、数据恢复 | 崩溃恢复 |
| 写入 | 事务提交时一次性写入 | 事务执行中不断写入 |

### 4. 两阶段提交是什么？

为了保证 binlog 和 redo log 的一致性：

1. **Prepare 阶段**：写 redo log，标记为 prepare 状态
2. **Commit 阶段**：写 binlog → 将 redo log 标记为 commit

崩溃恢复时：
- redo log 是 prepare + binlog 完整 → 提交
- redo log 是 prepare + binlog 不完整 → 回滚

---

## 四、SQL 优化

### 1. 一条 SQL 的执行过程？

1. **连接器**：建立连接，权限验证
2. **查询缓存**（8.0 已移除）：查缓存
3. **分析器**：词法分析 + 语法分析
4. **优化器**：选索引、确定 JOIN 顺序
5. **执行器**：调用存储引擎接口，获取数据

### 2. EXPLAIN 关注哪些字段？

| 字段 | 含义 |
|------|------|
| type | 访问类型：system > const > eq_ref > ref > range > index > ALL。至少要到 range |
| key | 实际使用的索引 |
| rows | 预估扫描行数，越少越好 |
| Extra | Using index（覆盖索引）好；Using filesort/Using temporary 差 |
| key_len | 索引使用的字节数 |

### 3. 慢查询怎么排查？

- 开启 `slow_query_log`，设置 `long_query_time`
- `EXPLAIN` 分析执行计划
- 常见原因：没走索引、索引失效、大量数据排序/分组、锁等待
- 优化手段：加索引、优化 SQL、读写分离、分库分表

### 4. 分库分表方案？

- **垂直分库**：按业务拆分（用户库、订单库），解决并发大的问题
- **垂直分表**：冷热字段分离，减少单行大小
- **水平分库分表**：按某字段（如 user_id）hash 取模拆分，解决单表数据量大的问题

**问题**：分布式事务、跨库 JOIN 困难、全局 ID 生成（雪花算法）

---

## 五、主从复制

### 主从复制流程？

1. Master 写 binlog
2. Slave 的 IO 线程读取 Master 的 binlog，写入 relay log
3. Slave 的 SQL 线程从 relay log 中重放 SQL

**延迟原因**：Slave 单线程回放（5.7+ 支持并行复制）、大事务、机器性能差异。

---

## 六、SQL查询操作

### 1. WHERE 和 HAVING 的区别？

| | WHERE | HAVING |
|---|-------|--------|
| 作用对象 | 对**原始行**进行过滤 | 对**分组后的结果**进行过滤 |
| 执行顺序 | GROUP BY **之前** | GROUP BY **之后** |
| 聚合函数 | **不能**使用聚合函数 | **可以**使用聚合函数 |

```sql
-- WHERE：过滤行，不能用聚合函数
SELECT * FROM user WHERE age > 18;

-- HAVING：过滤分组，可以用聚合函数
SELECT dept_id, COUNT(*) AS cnt
FROM user
GROUP BY dept_id
HAVING cnt > 5;
```

### 2. IN、BETWEEN、LIKE、IS NULL 怎么用？

| 操作符 | 用途 | 示例 |
|--------|------|------|
| IN | 匹配多个值 | `WHERE dept_id IN (1, 2, 3)` |
| BETWEEN | 范围查询（闭区间） | `WHERE age BETWEEN 18 AND 30` |
| LIKE | 模糊匹配 | `WHERE name LIKE '张%'` |
| IS NULL | 判空（**不能用 = NULL**） | `WHERE email IS NULL` |

**LIKE 注意**：`%` 匹配任意字符，`_` 匹配单个字符。`LIKE '%abc'` 会导致索引失效。

**NULL 注意**：NULL 表示"未知"，不能用 `=` 或 `!=` 比较，只能用 `IS NULL` 或 `IS NOT NULL`。

### 3. GROUP BY + 聚合函数怎么配合？

**常用聚合函数**：`COUNT`、`SUM`、`AVG`、`MAX`、`MIN`

```sql
SELECT dept_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal
FROM employee
GROUP BY dept_id;
```

**执行顺序**：WHERE → GROUP BY → 聚合函数 → HAVING → ORDER BY → LIMIT

**注意**：SELECT 中的非聚合列必须出现在 GROUP BY 中，否则报错（`ONLY_FULL_GROUP_BY` 模式下）。

### 4. ORDER BY 和 LIMIT 怎么用？

```sql
SELECT * FROM user
ORDER BY age DESC, name ASC
LIMIT 10 OFFSET 20;   -- 跳过前20条，取10条
```

- `ORDER BY`：默认 ASC（升序），DESC 降序。多列排序时从左到右依次比较
- `LIMIT m, n` 等价于 `LIMIT n OFFSET m`：跳过 m 条后取 n 条
- 大偏移量优化：`LIMIT 1000000, 10` 性能差，可用**延迟关联**——先用覆盖索引定位主键，再回表

```sql
-- 优化：先拿到主键，再关联取数据
SELECT * FROM user t1
INNER JOIN (SELECT id FROM user ORDER BY id LIMIT 1000000, 10) t2
ON t1.id = t2.id;
```

### 5. UNION 和 UNION ALL 的区别？

| | UNION | UNION ALL |
|---|-------|-----------|
| 去重 | 自动去重（DISTINCT） | 不去重 |
| 性能 | 慢（需要排序去重） | 快 |
| 使用场景 | 需要合并去重 | 明确无重复或允许重复 |

```sql
-- UNION：去重
SELECT name FROM student_a
UNION
SELECT name FROM student_b;

-- UNION ALL：不去重
SELECT name FROM student_a
UNION ALL
SELECT name FROM student_b;
```

**注意**：UNION 要求各 SELECT 的列数相同、对应列类型兼容。

### 6. INNER JOIN、LEFT JOIN、RIGHT JOIN 的区别？

| 类型 | 结果 |
|------|------|
| INNER JOIN | 两表**都匹配**的行 |
| LEFT JOIN | 左表**全部保留**，右表不匹配填 NULL |
| RIGHT JOIN | 右表**全部保留**，左表不匹配填 NULL |

```sql
-- 内联：只返回两表都匹配的
SELECT u.name, o.amount
FROM user u
INNER JOIN orders o ON u.id = o.user_id;

-- 左联：user 全部保留，没订单的 amount 为 NULL
SELECT u.name, o.amount
FROM user u
LEFT JOIN orders o ON u.id = o.user_id;

-- 右联：orders 全部保留
SELECT u.name, o.amount
FROM user u
RIGHT JOIN orders o ON u.id = o.user_id;
```

**LEFT JOIN 常见坑**：WHERE 条件过滤掉 NULL 等价于 INNER JOIN。如果想把条件作用在右表，应该写在 ON 里而非 WHERE 里。

### 7. 子查询有哪些类型？

| 类型 | 说明 | 示例 |
|------|------|------|
| 标量子查询 | 返回**单个值**（一行一列） | `SELECT * FROM user WHERE salary > (SELECT AVG(salary) FROM user)` |
| IN 子查询 | 检查是否在结果集中 | `SELECT * FROM user WHERE dept_id IN (SELECT id FROM dept WHERE name LIKE '技术%')` |
| EXISTS 子查询 | 检查子查询是否有**任意一行**结果 | `SELECT * FROM user u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)` |

**IN vs EXISTS**：
- IN 先执行子查询，返回结果集，再和外部匹配。适用于子查询结果集**小**的情况
- EXISTS 是**逐行**驱动外部表，对每一行执行子查询判断。适用于外部表**小**或子查询依赖外部表的情况

```sql
-- EXISTS：有订单的用户
SELECT * FROM user u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- NOT EXISTS：没订单的用户（通常比 NOT IN 更安全，NOT IN 遇到 NULL 会全空）
SELECT * FROM user u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### 8. 表别名和字段别名的使用场景？

**字段别名**：用 `AS` 给列起别名（AS 可省略），常用于聚合、计算、重命名

```sql
SELECT COUNT(*) AS total_users, AVG(salary) avg_sal FROM user;
```

**表别名**：给表起短名，常用于自连接和多表查询

```sql
-- 自连接：查询每个员工的上级
SELECT e.name AS emp, m.name AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id;
```

**别名执行顺序注意**：SELECT 中定义的别名在 WHERE 中不能用（WHERE 先执行），但可以在 GROUP BY、HAVING、ORDER BY 中使用。
