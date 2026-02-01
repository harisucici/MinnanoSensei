# Minnano Sensei Flutter App 开发计划

## 项目概述
基于《大家的日本语》教材的AI日语学习应用，使用Flutter框架开发跨平台移动应用。

## 项目结构
```
minnano_sensei_app/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   ├── user.dart
│   │   ├── lesson.dart
│   │   ├── vocabulary.dart
│   │   └── grammar.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── lesson_screen.dart
│   │   ├── practice_screen.dart
│   │   └── profile_screen.dart
│   ├── services/
│   │   ├── ai_service.dart
│   │   ├── auth_service.dart
│   │   ├── storage_service.dart
│   │   └── text_to_speech_service.dart
│   ├── widgets/
│   │   ├── lesson_card.dart
│   │   ├── vocabulary_item.dart
│   │   ├── grammar_explanation.dart
│   │   └── progress_indicator.dart
│   └── utils/
│       ├── constants.dart
│       └── helpers.dart
├── assets/
│   ├── images/
│   ├── icons/
│   └── textbooks/
├── test/
└── pubspec.yaml
```

## 功能模块

### 1. 用户管理模块
- 注册/登录（支持多种第三方登录）
- 个人信息管理
- 学习目标设置
- 水平评估

### 2. 教材管理模块
- 《大家的日本语》教材结构化展示
- 课程导航
- 内容检索

### 3. AI教学对话模块
- 实时语音/文字对话
- 情景化练习
- 即时纠错

### 4. 学习进度跟踪
- 进度可视化
- 成就系统
- 学习报告

## 技术栈
- Flutter (Dart)
- Firebase (认证、数据库、存储)
- 语音识别和合成插件
- 大语言模型API接口

## 依赖项 (pubspec.yaml)
```yaml
name: minnano_sensei_app
description: AI-powered Japanese Learning App based on "Minna no Nihongo"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.4
  firebase_storage: ^11.5.4
  provider: ^6.1.1
  shared_preferences: ^2.2.2
  sqflite: ^2.3.0
  path: ^1.8.0
  http: ^1.1.0
  speech_to_text: ^6.6.0
  flutter_tts: ^4.0.0
  cached_network_image: ^3.3.0
  intl: ^0.18.1
  json_annotation: ^4.8.1
  flutter_localizations:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.7
  json_serializable: ^6.7.1

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
    - assets/textbooks/
```

## 主要页面设计

### 登录页面 (LoginScreen)
- 支持多种登录方式
- 第三方登录按钮
- 注册入口

### 仪表盘页面 (DashboardScreen)
- 学习进度概览
- 当前课程推荐
- 快速启动AI对话

### 课程页面 (LessonScreen)
- 教材章节展示
- 语法点详解
- 生词表
- 练习题

### 练习页面 (PracticeScreen)
- AI对话界面
- 语音输入/输出
- 实时反馈

### 个人资料页面 (ProfileScreen)
- 学习统计
- 设置选项
- 成就展示

## 数据模型

### User
- id, name, email, nativeLanguage, learningGoal, level, studyPreferences

### Lesson
- id, title, textbook, chapter, content, grammarPoints, vocabulary, exercises

### Vocabulary
- id, word, reading, meaning, level, exampleSentences

### Grammar
- id, pattern, explanation, examples, usageNotes

### Progress
- userId, lessonId, completed, score, timestamp

## 服务层

### AuthService
- 用户认证
- 第三方登录集成

### StorageService
- 本地数据存储
- 云端同步

### AIService
- 与大语言模型API通信
- 对话逻辑处理
- 错误纠正

### TextToSpeechService
- 语音合成
- 语音识别

## 开发步骤

### 步骤1: 环境搭建
- 安装Flutter SDK
- 配置开发环境
- 创建项目

### 步骤2: 项目结构搭建
- 创建目录结构
- 设置依赖
- 配置pubspec.yaml

### 步骤3: 基础UI组件
- 设计主题
- 创建通用组件
- 实现页面布局

### 步骤4: 数据模型和服务
- 定义数据模型
- 实现服务层
- 集成Firebase

### 步骤5: 核心功能
- 用户管理
- 教材浏览
- AI对话集成

### 步骤6: 附加功能
- 学习进度跟踪
- 语音功能
- 离线支持

### 步骤7: 测试和优化
- 功能测试
- 性能优化
- 用户体验改进

## AI集成要点
- 与大语言模型API通信
- 提示工程（Prompt Engineering）
- RAG（检索增强生成）用于教材知识库
- 对话状态管理
- 安全过滤

## 本地化支持
- 中文、英文、日文、韩文等多语言UI
- 日语学习内容本地化
- 国际化日期和数字格式

## 性能考虑
- 离线缓存核心教材内容
- 图片和音频资源优化
- 数据库查询优化
- 网络请求管理
```

接下来，我们需要安装Flutter SDK才能继续创建项目。