---
title: Release InLong 1.1.0
sidebar_position: 1
---

Apache InLong is a one-stop integration framework for massive data that provides automatic, secure and reliable data transmission capabilities. InLong supports both batch and stream data processing at the same time, which offers great power to build data analysis, modeling and other real-time applications based on streaming data.

## 1.1.0 Features Overview
The 1.1.0-incubating just released mainly includes the following:

### Enhanced management capabilities for manager
- Added Manager Client to support the integration of InLong for creating data streams
- Added ManagerCtl command-line tool to support viewing and creating data streams
- Manager supports dispatching Agent tasks
- Manager supports dispatching Sort Flink tasks
- Manger data streams management, supports start, restart, pause operations
- Manager plugin support
- Manager metadata management supports using MySQL
- The first phase of cluster management, unified cluster information registration

### Rich data nodes
- Support Iceberg
- Support ClickHouse
- Support MySQL Binlog collection
- Support Kafka ingestion
- Sort Standalone supports multiple type streams

### Tools construction
- Dashboard plugin support
- Kubernetes deployment optimization
- Standalone deployment refactoring

### System Upgrade
- Protocol Buffers upgrade
- Unified version Maven version dependencies
- Fixed a bunch of dependency CVEs
- DataProxy supports PB compression protocol

This version closed about 642+ issues, including four 23 features and 180 improvements.

## 1.1.0 Features Details
### Add Manager Client
The newly added Manager Client defines common InLong Group/Stream operation interfaces, including task creation, viewing and deletion. Through Manager Client, users can build InLong into any third-party platform to achieve unified customized platform construction. The Manager Client is mainly designed and implemented by @kipshi, @gong, @ciscozhou, thanks to three contributors.

### Add ManagerCtl command line tool
ManagerCtl is developed based on Manager Client and is a command-line tool for manipulating InLong resources, which can further simplify the use of developers. ManagerCtl was contributed independently by @haifxu and includes guidelines including:
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

### Manager supports issuing Sort tasks
In previous versions, after the user created the data group/stream task, Sort needed to submit it to the Flink cluster through the command line, and then perform data sorting. In version 1.1.0, we unified the start, stop, and suspend operations of Sort tasks to the Manager to complete. Users only need to configure the correct Flink cluster when the Manager is deployed. When the data stream is approved, Sort will be automatically started. 
This part of the work is mainly contributed by @LvJiancheng.

### Manager metadata is saved to ZooKeeper
InLong uses ZooKeeper to save data stream metadata, which increases the deployment threshold and operation and maintenance difficulty for developers and users. 
In version 1.1.0, we save data stream metadata in DB by default, and ZooKeeper is only an optional solution in large-scale scenarios. Thanks to @kipshi @yunqingmoswu for contributing a PR to ZooKeeper.

### Support MySQL Binlog collection
Version 1.1.0 fully supports the collection of data from MySQL, and supports both incremental and full strategies. Users can collect MySQL data with simple configuration in InLong. This part of the work was contributed by @EMsnap.

### Sort Added Iceberg, ClickHouse, Kafka
In version 1.1.0, the storage of data nodes for various scenarios has been added, including Iceberg, ClickHouse, and Kafka. The support of these three streams enriches the usage scenarios of InLong. New stream support, mainly contributed by @chantccc @KevinWen007 @healchow.

### Sort Standalone supports Hive, Elasticsearch, Kafka
As mentioned in the previous version, for non-Flink environments, we can sort data streams through Sort Standalone. In version 1.1.0, we added support for Hive, ElasticSearch, Kafka, and expanded the usage scenarios of Sort Standalone. Sort Standalone is mainly contributed by @vernedeng @luchunliang.

### Protocol Buffers upgrade
All InLong components Protocol Buffers dependencies have been upgraded from 2.5.0 to 3.19.4. Thanks to @gosonzhang @doleyzi for their contributions, a lot of compatibility and testing work for Protocol Buffers upgrades.

### InLong on Kubernetes optimization
The optimization work of InLong on Kubernetes mainly includes adding Audit, combing configuration, optimizing the use of message queues, optimizing the use of documents, etc., to facilitate the use of InLong on the cloud. Thanks to @shink for contributing to these optimizations.

### Dashboard plugin
In order to facilitate users to quickly build new data stream on Dashboard, Dashboard is support plugin in version 1.1.0. JavaScript developers who understand the plugin development guidelines can quickly expand new data stream. Thanks for this part of the work @leezng

### Other features and bug fixes
For related content, please refer to the version [release notes](https://github.com/apache/incubator-inlong/blob/master/CHANGES.md), which list the features, enhancements and bug fixes of this version in detail, as well as specific contributors.

## Apache InLong(incubating) follow-up planning
In subsequent versions, we will support lightweight Sort, and expand more data sources and targets to cover more usage scenarios, including:
- Flink SQL support
- Elasticsearch, HBase support