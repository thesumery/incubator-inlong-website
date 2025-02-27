---
title: 0.11.0 版本发布
sidebar_position: 3
---

Apache InLong(incubating) 从 0.9.0 版本开始由原 Apache TubeMQ（incubating）改名而来，伴随着名称的改变，InLong 也由单一的消息队列升级为一站式海量数据集成框架，支持了大数据领域的采集、汇聚、缓存和分拣功能，用户只需要简单的配置就可以把数据从数据源导入到实时计算引擎或者落地到离线存储。
刚刚发布的 0.11.0-incubating 版本是改名之后的第三个版本，这个版本：
- 进一步降低用户的使用门槛，支持 InLong 所有模块 on Kubernets，并且对官网进行了重构，用户可以更加方便的查阅相关文档
- 支持更多的业务场景，增加 Dataproxy -> Pulsar 的数据流向，覆盖对数据完整性、一致性要求更高的场景
- 支持更多语言的 SDK，这个版本开放了生产级别的 TubeMQ Go SDK，方便使用 Go 语言的用户接入

该版本关闭超过 80 个 issue, 包含了四个重大 feature 和 35 个 improvements 。

### Apache InLong(incubating) 简介
[Apache InLong（应龙）](https://inlong.apache.org/zh-cn/)是腾讯捐献给 Apache 社区的一站式海量数据集成框架，提供自动、安全、可靠和高性能的数据传输能力，方便业务构建基于流式的数据分析、建模和应用。InLong 项目原本叫TubeMQ ，专注高性能、低成本的消息队列服务。为了进一步释放 TubeMQ 周边生态能力，我们将项目升级为 InLong ，专注打造一站式的数据集成解决方案。

Apache InLong 以腾讯内部使用的 TDBank 为原型，依托万亿级别的数据接入和处理能力，整合了数据采集、汇聚、存储、分拣数据处理全流程，拥有简单易用、灵活扩展、稳定可靠等特性。
<img src="../img/inlong-structure-zh.png" align="center" alt="Apache InLong"/>

 Apache InLong 服务于数据采集到落地的整个生命周期，按数据的不同阶段提供不同的处理模块，主要包括：
 - **inlong-agent** ，数据采集 Agent ，支持从指定目录或文件读取常规日志，进行逐条的数据上报。后续也将扩展 DB 采集，扩展HTTP上报等能力。
 - **inlong-dataproxy** ，一个基于 Flume-ng 的 Proxy 组件，支持数据发送阻塞、落盘重发，拥有将接收数据后转发到不同MQ（消息队列）的能力。
 - **inlong-tubemq** ，腾讯自研的消息队列服务，专注服务大数据场景下海量数据的高性能存储和传输，在海量实践和低成本方面有着比较好的核心优势。 注：InLong 0.11.0 后台中增加了对于Apache Pulsar的支持，全流程数据流和管控工作会在下个版本完成。
 - **inlong-sort** ，从不同的 MQ 消费数据后进行 ETL 处理，然后将数据汇聚并写入 Hive、ClickHouse、Hbase、IceBerg 等。
 - **inlong-manager** ，提供完整的数据服务管控能力，包括元数据、OpenAPI、任务流、权限等。
 - **inlong-website** ，一个用于管理数据接入的前端页面，简化整个 InLong 管控平台的使用。

### Apache InLong(incubating) 0.11.0 主要特性
#### InLong on Kubernetes 
InLong 包括了数据采集，数据汇聚，数据缓存、数据分拣以及集群管控等多个组件，为了方便用户使用和支持云原生特性，目前所有的组件都已经支持在 Kubernetes 部署。
感谢 @shink 贡献的这个特性，具体详情可以参考:
[INLONG-1308](https://github.com/apache/incubator-inlong/issues/1308)

#### dataproxy->pulsar 数据流打通
在 0.11.0 版本之前的版本，InLong 的数据缓存层只能支持 TubeMQ，TubeMQ 很适合于超大规模数据量的场景，但在极端场景下可能会有少量数据丢失的风向；为了提供数据可靠性，Inlong 在 0.11.0 版本中增加了对于 Apache Pulsar 的支持，现在InLong 后台可以支持数据流可以从 agent -> dataProxy -> tubeMQ/pulsar -> sort.  Pulsar 的引入，使得 InLong 覆盖的应用场景更加丰富，可以满足更多用户的需求。
感谢 @baomingyu 对于这个特性的贡献，更多详情可以参考:
[INLONG-1330](https://github.com/apache/incubator-inlong/issues/1330)

#### Go 语言 SDK
在 0.11.0 版本之前的 TubeMQ 支持 Java 、C++、 Python 三种语言的 SDK，随着 Go 语言的应用越来越多，社区中对于 Go 语言 SDK 的需求也日益增加，0.11.0 版本正式引入了 TubeMQ 的 Go 语言 SDK。丰富了多语言 SDK，也降低了 Go 语言用户的接入和使用难度。
感谢 @TszKitLo40 贡献的这个特性，更多详情可以参考：
[INLONG-624](https://github.com/apache/incubator-inlong/issues/624)
[INLONG-1578](https://github.com/apache/incubator-inlong/issues/1570)
[INLONG-1584](https://github.com/apache/incubator-inlong/issues/1584)
[INLONG-1666](https://github.com/apache/incubator-inlong/issues/1666)
[INLONG-1682](https://github.com/apache/incubator-inlong/issues/1682)

#### 官网重构
在 0.11.0 版本中，InLong 采用 Docusaurus 重构了[官网](https://inlong.apache.org/)，提供了更加简洁、直观的文档管理和展示。
感谢 @leezng 对于这个特性的贡献。更多详情可以参考：
[INLONG-1631](https://github.com/apache/incubator-inlong/issues/1631)
[INLONG-1632](https://github.com/apache/incubator-inlong/issues/1632)
[INLONG-1633](https://github.com/apache/incubator-inlong/issues/1633)
[INLONG-1634](https://github.com/apache/incubator-inlong/issues/1634)
[INLONG-1635](https://github.com/apache/incubator-inlong/issues/1635)
[INLONG-1636](https://github.com/apache/incubator-inlong/issues/1636)
[INLONG-1637](https://github.com/apache/incubator-inlong/issues/1637)
[INLONG-1638](https://github.com/apache/incubator-inlong/issues/1638)

除了上述重大 feature 之外，InLong 0.11.0 版本还有其他的关键改进，包括但不限于：
- 在主 Repo 中增加了贡献指引，[INLONG-1623](https://github.com/apache/incubator-inlong/issues/1623)
- 增加 Inlong-Manager 对 DataProxy 的配置管理，[INLONG-1595](https://github.com/apache/incubator-inlong/issues/1595)
- 优化了 github issue 模板，[INLONG-1585](https://github.com/apache/incubator-inlong/issues/1585)
- 代码 Checkstyle 优化，[INLONG-1571](https://github.com/apache/incubator-inlong/issues/1571), [INLONG-1593](https://github.com/apache/incubator-inlong/issues/1593), [INLONG-1593](https://github.com/apache/incubator-inlong/issues/1593), [INLONG-1662](https://github.com/apache/incubator-inlong/issues/1662)
- Agent 引入消息过滤器，[INLONG-1641](https://github.com/apache/incubator-inlong/issues/1641)

0.11.0 版本还修复了~45个bug，在此，感谢所有为 Inlong 社区做出贡献的各位同学（排名不分先后）
shink, baomingyu, TszKitLo40, leezng, ruanwenjun, leo65535, luchunliang, pierre94, EMsnap, dockerzhang, gosonzhang, healchow, guangxuCheng, yuanboliu


### Apache InLong(incubating) 后续规划
在 InLong 后续版本规划中，我们会进一步释放 InLong 的能力，覆盖更多的使用场景，主要包括

- 支持 Apache Pulsar 全链路数据接入能力，包括后端处理和前端管理能力。
- 支持 ClickHouse、Apache Iceberg、Apache HBase 等数据流向

### Apache InLong(incubating) 贡献者招募
Apache InLong(incubating) 当前的 contributor 共计62名，还处在项目孵化的初期，有很多工作需要做，包括社区运营、文档翻译、Feature 开发等，期待更多的开源爱好者一起共建，努力将 InLong 打造成 Apache 顶级项目，以下为 InLong 重要发展时间点：
- 2021年11月5日，发布0.11.0版本
- 2021年9月3日，发布0.10.0版本
- 2021年7月12日，发起更名后第一个版本 0.9.0 投票
- 2021年4月11日，完成社区改名，调整为 Apache InLong
- 2021年2月11日，发起社区改名变更申请
- 2020年12月20日，进行项目改名讨论和投票
- 2020年5月30日，按照 Apache 社区规范发布第一个社区版本
- 2019年11月3日，进入 Apache 社区孵化
- 2019年9月12日，TubeMQ 对外开源并捐献给 Apache 社区

