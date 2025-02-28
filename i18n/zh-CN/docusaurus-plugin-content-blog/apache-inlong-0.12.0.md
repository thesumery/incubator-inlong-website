---
title: 0.12.0 版本发布
sidebar_position: 2
---

InLong(应龙) : 中国神话故事里的神兽，引流入海，借喻 InLong 系统提供数据接入能力。

Apache InLong（应龙）是一个一站式海量数据集成框架，提供自动、安全、可靠和高性能的数据传输能力，同时支持批和流，方便业务构建基于流式的数据分析、建模和应用。InLong支持大数据领域的采集、汇聚、缓存和分拣功能，用户只需要简单的配置就可以把数据从数据源导入到实时计算引擎或者落地到离线存储。

刚刚发布的 0.12.0-incubating 主要包括以下内容：
- 提供自动、安全、可靠和高性能的数据传输能力，同时支持批和流
- 对官网文档结构进行重构，方便用户根据主线查阅相关文档
- 全流程支持Pulsar数据流向，完成高性能、高可靠场景的全流程覆盖
- 全流程支持指标，包括 JMX 和 Prometheus 输出
- 数据审计对账一期，将审计数据写入 MySQL

该版本关闭了约 120+ 个 issue，包含四个重大 feature 和 35 个 improvements。

### Apache InLong(incubating) 简介
[Apache InLong（应龙）](https://inlong.apache.org/zh-cn/) 是腾讯捐献给 Apache 社区的一站式海量数据集成框架，提供自动、安全、可靠和高性能的数据传输能力，方便业务构建基于流式的数据分析、建模和应用。 InLong 项目原名 TubeMQ ，专注于高性能、低成本的消息队列服务。为了进一步释放 TubeMQ 周边的生态能力，我们将项目升级为 InLong，专注打造一站式数据流接入服务平台。

Apache InLong 以腾讯内部使用的 TDBank 为原型，具有万亿级数据的接入和处理能力，整合了数据采集、汇聚、存储、分拣数据处理全流程，拥有简单易用、灵活扩展、稳定可靠等特性。
<img src="../img/inlong-structure-zh.png" align="center" alt="Apache InLong"/>

 Apache InLong 服务于数据采集到落地的整个生命周期，按数据的不同阶段提供不同的处理模块，主要包括：
 - **inlong-agent** ，数据采集 Agent ，支持从指定目录或文件读取常规日志，进行逐条的数据上报。后续也将扩展 DB 采集，扩展HTTP上报等能力。
 - **inlong-dataproxy** ，一个基于 Flume-ng 的 Proxy 组件，支持数据发送阻塞、落盘重发，拥有将接收数据后转发到不同MQ（消息队列）的能力。
 - **inlong-tubemq** ，腾讯自研的消息队列服务，专注服务大数据场景下海量数据的高性能存储和传输，在海量实践和低成本方面有着比较好的核心优势。
 - **inlong-sort** ，从不同的 MQ 消费数据后进行 ETL 处理，然后将数据汇聚并写入 Hive、ClickHouse、Hbase、IceBerg 等。
 - **inlong-manager** ，提供完整的数据服务管控能力，包括元数据、OpenAPI、任务流、权限等。
 - **inlong-website** ，一个用于管理数据接入的前端页面，简化整个 InLong 管控平台的使用。

### Apache InLong(incubating) 0.12.0 主要特性
#### 1. 打通 Apache Pulsar 全链路
在 0.12.0 版本中，我们补齐了 FileAgent → DataProxy → Pulsar → Sort 的数据上报能力，至此，InLong 支持高性能和高可靠数据接入场景：相比高吞吐的 TubeMQ，Apache Pulsar能提供更好的数据一致性，更适用于金融、计费等对数据可靠性要求极高的场景。
<img src="/img/pulsar-arch-zh.png" align="center" alt="Report via Pulsar"/>

感谢 @healzhou、 @baomingyu、@leezng、@bruceneenhl、@ifndef-SleePy 等同学对这个特性的贡献，更多信息请参考，相关 PR 见 [INLONG-1310](https://github.com/apache/incubator-inlong/issues/1310) ，使用指引见 [Pulsar使用示例](https://inlong.apache.org/zh-CN/docs/next/quick_start/pulsar_example/) 。

#### 2. 支持 JMX 和 Prometheus 指标
在已有的以文件输出指标之外，InLong 的各个组件开始逐步支持 JMX 和 Prometheus 指标的输出，以提升整个系统的可见性。目前包括 Agent，DataProxy，TubeMQ，Sort-Standalone 等模块已经支持上述指标，各个模块输出的指标的文档正在整理中。

感谢 @shink，@luchunliang，@EMsnap，@gosonzhang 等同学的贡献，相关 PR 见[INLONG-1712](https://github.com/apache/incubator-inlong/issues/1712) ，[INLONG-1786](https://github.com/apache/incubator-inlong/issues/1786) ，[INLONG-1796](https://github.com/apache/incubator-inlong/issues/1796) ，[INLONG-1827](https://github.com/apache/incubator-inlong/issues/1827) ，[INLONG-1851](https://github.com/apache/incubator-inlong/issues/1851) ，[INLONG-1926](https://github.com/apache/incubator-inlong/issues/1926) 。

#### 3. 模块能力扩充
Sort 模块增加了对 Apache Doris 存储的支持，实现了 Sort 分拣数据落地到 Apache Doris 的能力，使 InLong 的入库选择又多了一项。此外，为了丰富数据接入全流程的功能，增加了 Audit、Sort-Standalone 模块：
- Audit 模块提供数据流全流程的对账能力，通过数据流指标来监控系统的服务质量；
- Sort-Standalone 模块是一个不基于 Flink 的数据分拣模块，给系统增加了一个轻量级的数据分拣能力，便于业务快速搭建及使用。

Audit、Sort-Standalone 模块仍在开发中，版本稳定后将对外发布使用。

感谢 @huzk8，@doleyzi，@luchunliang 等同学的贡献，相关 PR 见 [INLONG-1821](https://github.com/apache/incubator-inlong/issues/1821) ，[INLONG-1738](https://github.com/apache/incubator-inlong/issues/1738) ，[INLONG-1889](https://github.com/apache/incubator-inlong/issues/1889) 。

#### 4. 官网文档目录重构
0.12.0 版本对功能模块的改进之外，官网结构以及使用文档方面也做了深度调整，包括重构文档的目录结构，补充完善各个模块的功能介绍，增加文档翻译，进一步提高 InLong 官网的文档可阅读性，实现快速查找、方便阅读。这块内容可以查看官网进行了解，目前文档还在持续建设中，欢迎大家提出宝贵的意见或建议。

感谢 @bluewang，@dockerzhang，@healchow 等同学的贡献，相关 PR 见 [INLONG-1711](https://github.com/apache/incubator-inlong/issues/1711) ，[INLONG-1740](https://github.com/apache/incubator-inlong/issues/1740) ，[INLONG-1802](https://github.com/apache/incubator-inlong/issues/1802) ，[INLONG-1809](https://github.com/apache/incubator-inlong/issues/1809) ，[INLONG-1810](https://github.com/apache/incubator-inlong/issues/1810) ，[INLONG-1815](https://github.com/apache/incubator-inlong/issues/1815) ，[INLONG-1822](https://github.com/apache/incubator-inlong/issues/1822) ，[INLONG-1840](https://github.com/apache/incubator-inlong/issues/1840) ，[INLONG-1856](https://github.com/apache/incubator-inlong/issues/1856) ，[INLONG-1861](https://github.com/apache/incubator-inlong/issues/1861) ，[INLONG-1867](https://github.com/apache/incubator-inlong/issues/1867) ，[INLONG-1878](https://github.com/apache/incubator-inlong/issues/1878) ，[INLONG-1901](https://github.com/apache/incubator-inlong/issues/1901) ，[INLONG-1939](https://github.com/apache/incubator-inlong/issues/1939) 。

#### 5. 其他特性及问题修复
相关内容请参考[版本发版说明](https://github.com/apache/incubator-inlong/blob/0.12.0-incubating-RC0/CHANGES.md) ，里面列出了本次版本详细的特性、改进，Bug 修复，以及具体的贡献者。

### Apache InLong(incubating) 后续规划
后续版本，我们会进一步释放 InLong 的能力，覆盖更多的使用场景，主要包括：
- 支持数据接入 ClickHouse 的链路
- 支持 DB 数据的采集
- 全链路的指标审计二期功能


### Apache InLong(incubating) 贡献者招募
Apache InLong(incubating) 当前共有 71 名 contributor，仍处在项目孵化的初期，还有很多待办事项，包括：Feature 开发、社区运营，文档翻译等，期待更多开源爱好者加入 InLong，一起将 InLong 打造成 Apache 顶级项目。以下为 InLong 项目的时间线：

- 2021年12月22日，发布 0.12.0 版本
- 2021年11月5日，发布0.11.0版本
- 2021年9月3日，发布0.10.0版本
- 2021年7月12日，发起更名后第一个版本 0.9.0 投票
- 2021年4月11日，完成社区改名，调整为 Apache InLong
- 2021年2月11日，发起社区改名变更申请
- 2020年12月20日，进行项目改名讨论和投票
- 2020年5月30日，按照 Apache 社区规范发布第一个社区版本
- 2019年11月3日，进入 Apache 社区孵化
- 2019年9月12日，TubeMQ 对外开源并捐献给 Apache 社区

