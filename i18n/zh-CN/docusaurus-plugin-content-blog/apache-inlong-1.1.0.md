---
title: 1.1.0 版本发布
sidebar_position: 1
---

Apache InLong（应龙）是一个一站式海量数据集成框架，提供自动、安全、可靠和高性能的数据传输能力，同时支持批和流，方便业务构建基于流式的数据分析、建模和应用。InLong支持大数据领域的采集、汇聚、缓存和分拣功能，用户只需要简单的配置就可以把数据从数据源导入到实时计算引擎或者落地到离线存储。

## 1.1.0 版本特性总览
刚刚发布的 1.1.0-incubating 主要包括以下内容：

### 管控能力增强
- 增加 Manager Client，支持集成 InLong 创建任务
- 增加 ManagerCtl 命令行工具，支持查看、创建数据流
- Manager 支持下发 Agent 任务
- Manager 支持下发 Sort Flink 任务
- Manger 流向任务管理，支持启动、重启、暂停操作
- Manager 插件化改造
- Manager 元数据管理支持使用 MySQL
- 集群管理一期，统一集群信息注册

### 数据节点丰富
- 支持 Iceberg 流向入库
- 支持 ClickHouse 流向入库
- 支持 MySQL Binlog 采集
- 支持 Kafka 采集
- Sort Standalone 支持多流向

### 配套工具建设
- Dashboard 插件化改造
- Kubernetes 部署优化
- Standalone 部署重构

### 系统升级
- Protocol Buffers 升级
- 统一版本 Maven 版本依赖
- 修复一批依赖 CVEs 问题
- DataProxy 支持 PB 压缩协议

该版本关闭了约 642+ 个 issue，包含 23+ 个重大 feature 和 180+ 个 improvements。

## 1.1.0 版本特性介绍
### 增加 Manager Client
新增的 Manager Client，定义了常见的 InLong Group/Stream 操作接口，包括任务的创建、查看和删除。用户通过 Manager Client，可以将 InLong 内置到任何第三方平台中，实现统一的定制化平台建设。Manager Client 主要是由 @kipshi 、 @gong、@ciscozhou 设计和实现，感谢三位贡献者。

### 增加 ManagerCtl 命令行工具
ManagerCtl 基于 Manager Client 开发完成，是一个操作 InLong 资源的命令行工具，可以进一步简化开发者的使用。ManagerCtl 是由 @haifxu 独立贡献，包括指引包括：
```
Usage: managerctl [options] [command] [command options]
Options:
-h, --help
Get all command about managerctl.
Commands:
create      Create resource by json file
Usage: create [options]
​
describe      Display details of one or more resources
Usage: describe [options]
​
list      Displays main information for one or more resources
Usage: list [options]
```

### Manager 支持下发 Sort 任务
在之前版本，用户创建完数据流 Group/Stream 任务后，Sort 需要通过命令行提交到 Flink 集群，再去执行数据分拣工作。在 1.1.0 版本中，我们将 Sort 任务的启动、停止、挂起操作，统一到 Manager 完成，用户只需要在 Manager 部署时配置正确的 Flink 集群，当数据流审批通过后，会自动拉起 Sort 任务。该部分工作主要是由 @LvJiancheng 贡献完成。

### Manager 元数据保存去 ZooKeeper
InLong 使用 ZooKeeper 保存数据流元数据，增加了开发者和用户的部署门槛和运维难度。在 1.1.0 版本中，我们默认将数据流元数据保存在 DB 中，ZooKeeper 只作为大规模场景下可选方案。感谢 @kipshi @yunqingmoswu 贡献了去 ZooKeeper 的 PR。

### 支持 MySQL Binlog 采集
1.1.0 版本完整支持了从 MySQL 采集数据，支持增量和全量两种策略，用户可以在 InLong 简单配置就可以实现 MySQL 数据的采集。该部分工作是由 @EMsnap 贡献完成。

### Sort 新增 Iceberg、 ClickHouse、 Kafka 流向入库
1.1.0 版本中增加了多种场景数据节点的入库，包括 Iceberg、 ClickHouse、 Kafka，这三种流向的支持丰富了 InLong 的使用场景。新流向的支持，主要由@chantccc @KevinWen007 @healchow 参与贡献。

### Sort Standalone 支持 Hive、Elasticsearch、Kafka
之前版本有提到，对于非 Flink 环境，我们可以通过 Sort Standalone 来进行数据流分拣。在 1.1.0 版本中，我们增加了对 Hive、ElasticSearch、Kafka 的支持，扩展了 Sort Standalone 的使用场景。Sort Standalone 主要有 @vernedeng @luchunliang 参与贡献。

### Protocol Buffers 升级
InLong 所有组件 Protocol Buffers 依赖从 2.5.0 升级到 3.19.4，感谢 @gosonzhang @doleyzi 的贡献，为 Protocol Buffers 升级做的大量兼容和测试工作。

### InLong on Kubernetes 优化
InLong on Kubernetes 的优化工作主要包括增加 Audit、梳理配置、优化消息队列使用、优化文档使用等，方便 InLong 上云的使用。感谢 @shink 为这些优化做的贡献。

### Dashboard 插件化
为了方便用户快速在 Dashboard 构建新的流向，1.1.0 版本中实现了 Dashboard 插件化，了解 JavaScript 开发者基于插件开发指引，可以快速扩展新的数据流向。这部分工作感谢 @leezng

### 其他特性及问题修复
相关内容请参考[版本说明](https://github.com/apache/incubator-inlong/blob/master/CHANGES.md)，其中详细列出了本次版本的特性、提升 和 Bug 修复，以及具体的贡献者。

## Apache InLong(incubating) 后续规划
后续版本，我们将支持轻量化的 Sort，以及扩展更多的数据源端和目标端，覆盖更多的使用场景，主要包括：
- Flink SQL 支持
- Elasticsearch、HBase 流向支持